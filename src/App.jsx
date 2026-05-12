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
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/complete-setup' element={<CompleteSetup />} />
        <Route path='/recuperar-password' element={<ForgotPassword />} />
        {/* Rutas Protegidas */}
        <Route element={<DashboardLayout />}>
          <Route path='/dashboard' element={<SuperAdminDashboard />} />
          <Route path='/escuelas' element={<ListaEscuelas />} />
          <Route path='/registrar-escuela' element={<FormNuevaEscuela />} />
          <Route path='/configuracion' element={<Settings />} />
        </Route>

        <Route path='/' element={<Navigate to='/dashboard' />} />
      </Routes>
    </Router>
  );
}

export default App;
