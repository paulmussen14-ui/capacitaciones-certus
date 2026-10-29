import { useEffect, useState } from "react";
import { apiFetch } from "./services/api";
import Button from "./components/Button/Button";
import Logo from "./components/Logo/Logo";

export default function App() {
  const [estado, setEstado] = useState("Comprobando conexión...");

  useEffect(() => {
    apiFetch("/health")
      .then((d) => setEstado(`API y base de datos: ${d.status}`))
      .catch((e) => setEstado(`Error: ${e.message}`));
  }, []);

  return (
    <div className="container">
      <Logo size="lg" />
      <h1>{estado}</h1>
      <Button onClick={() => window.location.reload()}>Reintentar</Button>
    </div>
  );
}