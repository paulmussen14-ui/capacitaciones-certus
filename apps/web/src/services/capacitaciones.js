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

export async function eliminarCapacitacion(id, password) {
    await apiFetch(`/capacitaciones/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ password }),
    });
}

export async function subirImagenCapacitacion(id, archivo) {
    const formulario = new FormData();
    formulario.append('imagen', archivo);
    const datos = await apiFetch(`/capacitaciones/${id}/imagen`, {
        method: 'POST',
        body: formulario,
    });
    return datos.capacitacion;
}

export async function quitarImagenCapacitacion(id) {
    const datos = await apiFetch(`/capacitaciones/${id}/imagen`, { method: 'DELETE' });
    return datos.capacitacion;
}
