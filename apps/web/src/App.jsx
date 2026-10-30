import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RedirectInicio from "./components/ProtectedRoute/RedirectInicio";
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
        <Route
          path="/admin"
          element={<Panel titulo="Panel del administrador" />}
        />
      </Route>

      <Route path="*" element={<RedirectInicio />} />
    </Routes>
  );
}