import { createTheme } from "@mui/material/styles";

export const premiumTheme = createTheme({
  palette: {
    primary: { main: "#f06292" }, // Rosa principal
    secondary: { main: "#7b1fa2" },
    background: { default: "#fcf8fa" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "8px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
      },
    },
  },
});
