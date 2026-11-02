import { useCallback, useEffect, useState } from 'react';

export function useLista(cargar, parametro = '') {
    const [version, setVersion] = useState(0);
    const [resultado, setResultado] = useState({ clave: null, filas: [], error: '' });

    const clave = `${parametro}#${version}`;

    useEffect(() => {
        let vigente = true;

        cargar(parametro)
        .then((filas) => {
            if (vigente) setResultado({ clave, filas, error: '' });
        })
        .catch((error) => {
            if (vigente) setResultado({ clave, filas: [], error: error.message });
        });

        return () => {
        vigente = false;
        };
    }, [cargar, parametro, clave]);

    const recargar = useCallback(() => setVersion((valor) => valor + 1), []);

    return {
        filas: resultado.filas,
        error: resultado.error,
        cargando: resultado.clave !== clave,
        recargar,
    };
}