import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Box, CircularProgress, Typography } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "16px",
  marginTop: "15px",
};

// Coordenadas iniciales por defecto (Toluca / Estado de México)
const centerDefault = {
  lat: 19.2898,
  lng: -99.57,
};

const LocationPicker = ({ onLocationSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);

  // Inicializamos la posición intentando leer lo que ya esté en memoria local
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

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  // Función al soltar el PIN
  const handleMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // Seteamos la posición local numéricamente limpia
    setPosition({ lat, lng });

    // Invocamos el Geocoder para obtener la dirección textual
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        // Emitimos al componente padre asegurando el tipado numérico
        onLocationSelect({
          address: results[0].formatted_address,
          lat: Number(lat),
          lng: Number(lng),
        });
      }
    });
  };

  if (!isLoaded) return <CircularProgress color='secondary' />;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant='body2'
        color='textSecondary'
        sx={{ mb: 1, fontWeight: 500 }}
      >
        Arrastra el marcador rosa hasta la ubicación exacta de tu academia:
      </Typography>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            // Estilo ultra-limpio y suave (ideal para estética premium/estilistas)
            {
              featureType: "administrative",
              elementType: "geometry",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi",
              stylers: [{ visibility: "simplified" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }],
            },
          ],
        }}
      >
        <Marker
          position={position}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
          animation={window.google.maps.Animation.DROP}
        />
      </GoogleMap>
    </Box>
  );
};

export default LocationPicker;
