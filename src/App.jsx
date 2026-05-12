import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/SuperAdmin/DashboardHome";
import Login from "./pages/Auth/Login";
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />

        {/* Rutas Protegidas */}
        <Route element={<DashboardLayout />}>
          <Route path='/dashboard' element={<DashboardHome />} />
          {/* <Route path='/escuelas' element={<ListaEscuelas />} />
        <Route path='/configuracion' element={<SettingsPage />} /> */}
        </Route>

        <Route path='/' element={<Navigate to='/dashboard' />} />
      </Routes>
    </Router>
  );
}

export default App;
