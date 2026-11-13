import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authApi from "../services/auth";

export default function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let vigente = true;

        authApi
        .obtenerSesion()
        .then((datos) => {
            if (vigente) setUsuario(datos.usuario);
        })
        .catch(() => {
            if (vigente) setUsuario(null);
        })
        .finally(() => {
            if (vigente) setCargando(false);
        });

        return () => {
        vigente = false;
        };
    }, []);

    const iniciarSesion = useCallback(async (correo, password) => {
        const datos = await authApi.iniciarSesion(correo, password);
        setUsuario(datos.usuario);
        return datos.usuario;
    }, []);

    const cerrarSesion = useCallback(async () => {
        try {
        await authApi.cerrarSesion();
        } finally {
        setUsuario(null);
        }
    }, []);

    const valor = useMemo(
        () => ({ usuario, cargando, iniciarSesion, cerrarSesion }),
        [usuario, cargando, iniciarSesion, cerrarSesion],
    );

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}