import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { premiumTheme } from "./theme/index.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SchoolProvider } from "./context/SchoolContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={premiumTheme}>
      <CssBaseline />
      <AuthProvider>
        <SchoolProvider>
          <App />
        </SchoolProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
