import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Box, CircularProgress, Typography } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "16px",
  marginTop: "15px",
};

// Coordenadas iniciales (Estado de México aprox)
const centerDefault = {
  lat: 19.1934,
  lng: -99.51,
};

const LocationPicker = ({ onLocationSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // REEMPLAZA ESTO
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(centerDefault);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  // Función al soltar el PIN
  const handleMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });

    // Invocamos el Geocoder para obtener la dirección textual
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          onLocationSelect({
            address: results[0].formatted_address,
            lat,
            lng,
          });
        }
      }
    });
  };

  if (!isLoaded) return <CircularProgress color='secondary' />;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>
        Arrastra el marcador hasta la ubicación exacta de tu academia:
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
            /* Aquí puedes pegar un estilo rosa/pastel luego */
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
