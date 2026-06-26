// src/context/GoogleMapsProvider.jsx
import React, { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_OPTIONS = {
  id: "google-map-script",
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  // 🌟 Importante: Cargar "places" y "marker" de forma explícita
  libraries: ["places", "marker"],
  language: "es",
  region: "MX",
  version: "weekly", // 🚀 Cambiamos a la versión semanal para activar Web Components nativos
};

const GoogleMapsContext = createContext({ isLoaded: false, loadError: null });

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_OPTIONS);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
