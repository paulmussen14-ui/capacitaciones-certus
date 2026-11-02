import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RedirectInicio from "./components/ProtectedRoute/RedirectInicio";
import AdminInicio from "./pages/AdminInicio/AdminInicio";
import Capacitaciones from "./pages/Capacitaciones/Capacitaciones";
import Docentes from "./pages/Docentes/Docentes";
import Login from "./pages/Login/Login";
import Panel from "./pages/Panel/Panel";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute roles={["docente"]} />}>
        <Route path="/docente" element={<Panel titulo="Panel del docente" />} />
      </Route>

      <Route element={<ProtectedRoute roles={["administrador"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminInicio />} />
          <Route path="/admin/capacitaciones" element={<Capacitaciones />} />
          <Route path="/admin/docentes" element={<Docentes />} />
        </Route>
      </Route>

      <Route path="*" element={<RedirectInicio />} />
    </Routes>
  );
}