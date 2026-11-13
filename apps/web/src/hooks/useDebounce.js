import { useEffect, useState } from 'react';

export function useDebounce(valor, ms = 300) {
    const [valorRetrasado, setValorRetrasado] = useState(valor);

    useEffect(() => {
        const temporizador = setTimeout(() => setValorRetrasado(valor), ms);
        return () => clearTimeout(temporizador);
    }, [valor, ms]);

    return valorRetrasado;
}