import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/SuperAdmin/DashboardHome";
import Login from "./pages/Auth/Login";
import Settings from "./pages/Settings/Settings";
import ListaEscuelas from "./pages/SuperAdmin/Escuelas";
import FormNuevaEscuela from "./pages/SuperAdmin/FormNuevaEscuela";
import CompleteSetup from "./pages/Auth/CompleteSetup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import DashboardRouter from "./pages/DashboardRouter";
import GestionSalones from "./pages/SchoolAdmin/Salones/GestionSalones";
import GestionCursos from "./pages/SchoolAdmin/Cursos/GestionCursos";
import { useAuth } from "./context/AuthContext";
function App() {
  const { loading, profile } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Cargando aplicación...</p>
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/complete-setup' element={<CompleteSetup />} />
        <Route path='/recuperar-password' element={<ForgotPassword />} />

        {/* Rutas Protegidas */}
        <Route element={<DashboardLayout />}>
          {/* El DashboardRouter decide qué dashboard mostrar */}
          <Route path='/dashboard' element={<DashboardRouter />} />

          {/* Rutas de SuperAdmin (Tú) */}
          <Route path='/escuelas' element={<ListaEscuelas />} />
          <Route path='/registrar-escuela' element={<FormNuevaEscuela />} />

          {/* Rutas de Admin de Escuela (Tus clientes) */}
          <Route path='/salones' element={<GestionSalones />} />
          <Route path='/cursos' element={<GestionCursos />} />

          <Route path='/configuracion' element={<Settings />} />
        </Route>

        <Route path='/' element={<Navigate to='/dashboard' />} />
      </Routes>
    </Router>
  );
}

export default App;
