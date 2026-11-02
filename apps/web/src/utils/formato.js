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