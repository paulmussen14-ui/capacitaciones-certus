import { apiFetch } from "./api";


export function iniciarSesion(correo, password) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ correo, password }),
    });
}

export function cerrarSesion() {
    return apiFetch("/auth/logout", { method: "POST" });
}

export function obtenerSesion() {
    return apiFetch("/auth/me");
}