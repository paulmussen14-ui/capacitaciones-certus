import "./Logo.css";
import logoProyecto from "../../assets/images/logos/logo-proyecto.svg";

export default function Logo({ size = "md" }) {
  return (
    <img
      className={`logo logo--${size}`}
      src={logoProyecto}
      alt="Logo de Capacitación Docente"
    />
  );
}