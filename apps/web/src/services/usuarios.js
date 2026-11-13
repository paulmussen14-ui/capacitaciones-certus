import { apiFetch } from './api';

export async function listarUsuarios(busqueda = '') {
    const parametros = busqueda ? `?q=${encodeURIComponent(busqueda)}` : '';
    const datos = await apiFetch(`/usuarios${parametros}`);
    return datos.usuarios;
}

export async function crearUsuario(usuario) {
    const datos = await apiFetch('/usuarios', {
        method: 'POST',
        body: JSON.stringify(usuario),
    });
    return datos.usuario;
}

export async function actualizarUsuario(id, usuario) {
    const datos = await apiFetch(`/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(usuario),
    });
    return datos.usuario;
}

export async function cambiarEstadoUsuario(id, activo) {
    const datos = await apiFetch(`/usuarios/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ activo }),
    });
    return datos.usuario;
}

export async function subirFotoUsuario(id, archivo) {
    const formulario = new FormData();
    formulario.append('imagen', archivo);
    const datos = await apiFetch(`/usuarios/${id}/foto`, {
        method: 'POST',
        body: formulario,
    });
    return datos.usuario;
}

export async function quitarFotoUsuario(id) {
    const datos = await apiFetch(`/usuarios/${id}/foto`, { method: 'DELETE' });
    return datos.usuario;
}
