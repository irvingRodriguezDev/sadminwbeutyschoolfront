import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import LocationPicker from "../LocationPiker";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
const StepperOne = ({
  logoUrl,
  setLocationData,
  handleLogoChange,
  isSubiendoLogo,
  locationData,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box>
        <Typography variant='h6' sx={{ fontWeight: 800, color: "#1a1a1a" }}>
          Identidad Visual
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Sube el logo oficial de tu academia.
        </Typography>
      </Box>

      <Button
        variant='outlined'
        component='label'
        disabled={isSubiendoLogo}
        startIcon={
          isSubiendoLogo ? (
            <CircularProgress size={16} color='inherit' />
          ) : (
            <CloudUploadRoundedIcon />
          )
        }
        sx={{
          color: "#E21F8B",
          borderColor: "rgba(240, 98, 146, 0.5)",
          textTransform: "none",
          fontWeight: 700,
          borderRadius: "10px",
          px: 3,
        }}
      >
        {isSubiendoLogo
          ? "Subiendo..."
          : logoUrl
            ? "Cambiar Logo"
            : "Seleccionar Imagen"}
        <input
          type='file'
          hidden
          accept='image/*'
          onChange={handleLogoChange}
        />
      </Button>

      {logoUrl && (
        <Typography
          variant='caption'
          sx={{
            color: "#2e7d32",
            fontWeight: 700,
            bgcolor: "rgba(46,125,50,0.06)",
            px: 2,
            py: 0.5,
            borderRadius: "20px",
          }}
        >
          ✓ Logo cargado en el servidor con éxito
        </Typography>
      )}

      <Divider sx={{ width: "100%", borderColor: "rgba(0,0,0,0.05)", my: 1 }} />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 800, color: "#1a1a1a" }}>
          Dirección Geográfica
        </Typography>
        {/* Le pasamos el valor inicial recuperado de memoria si existe */}
        <LocationPicker
          initialValue={locationData}
          onLocationSelect={(data) => setLocationData(data)}
        />
        {locationData.address && (
          <Typography
            variant='body2'
            sx={{ color: "#E21F8B", fontWeight: 600, mt: 1 }}
          >
            📍 {locationData.address}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StepperOne;
