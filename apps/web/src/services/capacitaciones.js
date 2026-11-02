import { apiFetch } from './api';

export async function listarCapacitaciones(busqueda = '') {
    const parametros = busqueda ? `?q=${encodeURIComponent(busqueda)}` : '';
    const datos = await apiFetch(`/capacitaciones${parametros}`);
    return datos.capacitaciones;
}

export async function crearCapacitacion(capacitacion) {
    const datos = await apiFetch('/capacitaciones', {
        method: 'POST',
        body: JSON.stringify(capacitacion),
    });
    return datos.capacitacion;
}

export async function actualizarCapacitacion(id, capacitacion) {
    const datos = await apiFetch(`/capacitaciones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(capacitacion),
    });
    return datos.capacitacion;
}

export async function cambiarEstadoCapacitacion(id, activa) {
    const datos = await apiFetch(`/capacitaciones/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ activa }),
    });
    return datos.capacitacion;
}