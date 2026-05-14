import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { premiumTheme } from "./theme/index.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SchoolProvider } from "./context/SchoolContext.jsx";
import { CursoProvider } from "./context/CursoContext.jsx";
import { SuperAdminProvider } from "./context/SuperAdminContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={premiumTheme}>
      <CssBaseline />
      <AuthProvider>
        <SuperAdminProvider>
          <SchoolProvider>
            <CursoProvider>
              <App />
            </CursoProvider>
          </SchoolProvider>
        </SuperAdminProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
