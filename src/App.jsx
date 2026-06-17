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
import LoadingScreen from "./components/common/LoadingScreen";
import AltaSalon from "./pages/SchoolAdmin/Salones/AltaSalon";
import AltaCursoStepper from "./pages/SchoolAdmin/Cursos/AltaCurso";
import GestionInscripciones from "./pages/SchoolAdmin/Inscripciones/GestionInscripciones";
import NewInscription from "./pages/SchoolAdmin/Inscripciones/NewInscriptionModal";
import GestionFinanzas from "./pages/SchoolAdmin/Finanzas/GestionFinanzas";
import ScannerView from "./pages/SchoolAdmin/Scanner/Scanner";
function App() {
  const { loading, profile } = useAuth();

  if (loading) {
    return <LoadingScreen message='Cargando aplicación' />;
  }
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/completed-setup' element={<CompleteSetup />} />
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
          <Route path='/crear-curso-nuevo' element={<AltaCursoStepper />} />

          <Route path='/inscripciones' element={<GestionInscripciones />} />
          <Route
            path='/crear-inscripcion/:schoolId'
            element={<NewInscription />}
          />

          <Route path='/finanzas' element={<GestionFinanzas />} />
          <Route path='/scanner-asistencia' element={<ScannerView />} />

          <Route path='/configuracion' element={<Settings />} />
        </Route>

        <Route path='/' element={<Navigate to='/dashboard' />} />
      </Routes>
    </Router>
  );
}

export default App;
