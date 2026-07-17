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
import { AdminSchoolProvider } from "./context/AdminSchoolContext.jsx";
import { InscriptionsProvider } from "./context/InscriptionsContext.jsx";
import { StudentsProvider } from "./context/StudentsContext.jsx";
import { FinanceProvider } from "./context/FinanzeContext.jsx";
import { GoogleMapsProvider } from "./context/GoogleMapsProvider.jsx";
import { ExpensesProvider } from "./context/ExpensesContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={premiumTheme}>
      <CssBaseline />
      <GoogleMapsProvider>
        <AuthProvider>
          <SuperAdminProvider>
            <AdminSchoolProvider>
              <SchoolProvider>
                <CursoProvider>
                  <StudentsProvider>
                    <InscriptionsProvider>
                      <FinanceProvider>
                        <ExpensesProvider>
                          <App />
                        </ExpensesProvider>
                      </FinanceProvider>
                    </InscriptionsProvider>
                  </StudentsProvider>
                </CursoProvider>
              </SchoolProvider>
            </AdminSchoolProvider>
          </SuperAdminProvider>
        </AuthProvider>
      </GoogleMapsProvider>
    </ThemeProvider>
  </StrictMode>,
);
