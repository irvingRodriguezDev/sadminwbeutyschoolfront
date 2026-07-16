import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import {
  Box,
  CircularProgress,
  Typography,
  Fab,
  TextField,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import { useGoogleMaps } from "../../context/GoogleMapsProvider";

const containerStyle = {
  width: "100%",
  height: "380px",
  borderRadius: "16px",
  marginTop: "15px",
};

const centerDefault = {
  lat: 19.2898,
  lng: -99.57,
};

const LocationPicker = ({ onLocationSelect }) => {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState(null);

  // Referencias para controlar los elementos nativos de Google
  const inputContainerRef = useRef(null);
  const nativeMarkerRef = useRef(null);

  const [position, setPosition] = useState(() => {
    const savedLocation = localStorage.getItem("locationData");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed.lat && parsed.lng) {
          return { lat: Number(parsed.lat), lng: Number(parsed.lng) };
        }
      } catch (e) {
        console.error("Error leyendo posición inicial en mapa:", e);
      }
    }
    return centerDefault;
  });

  // Helper para obtener la dirección textual a partir de coordenadas usando el Geocoder clásico
  const fetchAddressFromCoords = useCallback(
    (lat, lng) => {
      if (!window.google) return;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          onLocationSelect({
            address: results[0].formatted_address,
            lat: Number(lat),
            lng: Number(lng),
          });
        }
      });
    },
    [onLocationSelect],
  );

  // 🎯 Inicializar y actualizar el Marcador Avanzado Nativo de Google
  useEffect(() => {
    if (!isLoaded || !map || !window.google) return;

    const initAdvancedMarker = async () => {
      // Importamos dinámicamente la nueva librería de marcadores
      const { AdvancedMarkerElement } =
        await window.google.maps.importLibrary("marker");

      // Si el marcador ya existe, solo movemos su posición
      if (nativeMarkerRef.current) {
        nativeMarkerRef.current.position = position;
        return;
      }

      // Crear el elemento visual Rosa usando un DOM puro (adiós SVGs en strings prop de Marker)
      const pinContainer = document.createElement("div");
      pinContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
          <path fill="#F06292" stroke="#FFFFFF" strokeWidth="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;

      // Inicializar el AdvancedMarkerElement real de Google
      const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        gmpDraggable: true, // Habilitar arrastre en la nueva API
        content: pinContainer,
      });

      // Escuchar el evento de arrastre de la nueva API
      marker.addListener("dragend", (e) => {
        const lat = marker.position.lat;
        const lng = marker.position.lng;
        setPosition({ lat, lng });
        fetchAddressFromCoords(lat, lng);
      });

      nativeMarkerRef.current = marker;
    };

    initAdvancedMarker();

    // Limpieza al desmontar el componente
    return () => {
      if (nativeMarkerRef.current) {
        nativeMarkerRef.current.map = null;
        nativeMarkerRef.current = null;
      }
    };
  }, [isLoaded, map, position, fetchAddressFromCoords]);

  // 🎯 Inicializar el Nuevo Autocomplete usando la API Moderna de Google
  useEffect(() => {
    if (!isLoaded || !map || !window.google) return;

    let autocompleteInstance = null;

    const initAutocompleteNew = async () => {
      // Cargamos la librería de lugares moderna tal cual tu investigación
      const { Place } = await window.google.maps.importLibrary("places");

      const inputElement = inputContainerRef.current?.querySelector("input");
      if (!inputElement) return;

      // Creamos el Autocomplete de la nueva API enlazado al input de MUI
      autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputElement,
        {
          fields: ["geometry", "formatted_address", "name"],
        },
      );

      // Escuchamos la selección del lugar (Mecanismo moderno de suscripción)
      autocompleteInstance.addListener("place_changed", async () => {
        const place = autocompleteInstance.getPlace();

        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const newCoords = { lat, lng };

          setPosition(newCoords);
          map.panTo(newCoords);
          map.setZoom(16);

          onLocationSelect({
            address: place.formatted_address || place.name,
            lat: Number(lat),
            lng: Number(lng),
          });
        }
      });
    };

    initAutocompleteNew();
  }, [isLoaded, map, onLocationSelect]);

  const handleGetCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (positionGPS) => {
          const lat = positionGPS.coords.latitude;
          const lng = positionGPS.coords.longitude;
          const currentCoords = { lat, lng };

          setPosition(currentCoords);
          map?.panTo(currentCoords);
          fetchAddressFromCoords(lat, lng);
        },
        (error) => {
          console.warn("Permiso de ubicación denegado:", error);
        },
        { enableHighAccuracy: true },
      );
    }
  }, [map, fetchAddressFromCoords]);

  useEffect(() => {
    const savedLocation = localStorage.getItem("locationData");
    if (isLoaded && !savedLocation) {
      handleGetCurrentLocation();
    }
  }, [isLoaded, handleGetCurrentLocation]);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
          gap: 2,
        }}
      >
        <CircularProgress color='secondary' />
        <Typography variant='caption' color='textSecondary'>
          Cargando mapa de cobertura...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Typography
        variant='body2'
        color='textSecondary'
        sx={{ mb: 1, fontWeight: 500 }}
      >
        Busca tu dirección o arrastra el marcador rosa hasta la ubicación
        exacta:
      </Typography>

      {/* 🔍 INPUT DE BÚSQUEDA CONTROLADO CON REF PARA LA NUEVA API */}
      <Box ref={inputContainerRef}>
        <TextField
          fullWidth
          size='small'
          placeholder='Escribe tu ciudad, colonia o calle...'
          variant='outlined'
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ color: "#F06292", mr: 1 }} />,
            },
          }}
          sx={{
            bgcolor: "#fff",
            borderRadius: "12px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "& fieldset": { border: "1px solid rgba(240, 98, 146, 0.3)" },
              "&:hover fieldset": { borderColor: "#F06292" },
              "&.Mui-focused fieldset": {
                borderColor: "#F06292",
                borderWidth: "2px",
              },
            },
          }}
        />
      </Box>

      <Box sx={{ position: "relative", width: "100%" }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={15}
          onLoad={onLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapId: "DEMO_MAP_ID", // Requerido obligatoriamente por AdvancedMarkerElement
          }}
        >
          {/* 🌟 NOTA: El marcador ya no se renderiza como JSX aquí adentro. 
              Ahora se inyecta de forma nativa mediante la referencia useEffect de arriba, 
              evitando al 100% las alertas de depreciación del wrapper antiguo. */}
        </GoogleMap>

        <Fab
          color='secondary'
          size='small'
          aria-label='Ubicación actual'
          onClick={handleGetCurrentLocation}
          sx={{
            position: "absolute",
            bottom: 120,
            right: 10,
            bgcolor: "#ffffff",
            color: "#F06292",
            "&:hover": { bgcolor: "#fce4ec" },
            boxShadow: "0px 4px 12px rgba(240, 98, 146, 0.3)",
          }}
        >
          <MyLocationIcon size='small' />
        </Fab>
      </Box>
    </Box>
  );
};

export default LocationPicker;
