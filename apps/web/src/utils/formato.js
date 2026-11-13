export function formatearFecha(fecha) {
    if (!fecha) return null;
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
}

export function formatearRango(inicio, fin) {
    const desde = formatearFecha(inicio);
    const hasta = formatearFecha(fin);
    if (desde && hasta) return `${desde} – ${hasta}`;
    if (desde) return `Desde ${desde}`;
    if (hasta) return `Hasta ${hasta}`;
    return '—';
}

// Para marcas de tiempo completas (por ejemplo la fecha de alta de una cuenta)
export function formatearMarcaDeTiempo(marca) {
    if (!marca) return null;
    const fecha = new Date(marca);
    if (Number.isNaN(fecha.getTime())) return null;
    return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
