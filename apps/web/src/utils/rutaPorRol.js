export function rutaPorRol(rol) {
    return rol === "administrador" ? "/admin" : "/docente";
}