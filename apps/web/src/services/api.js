export async function apiFetch(path, options = {}) {
    // Con FormData (subida de archivos) el navegador pone solo el Content-Type
    const esArchivo = options.body instanceof FormData;
    let response;
    try {
        response = await fetch(`/api${path}`, {
        headers: esArchivo ? {} : { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options,
        });
    } catch {
        throw new Error('No se pudo conectar con el servidor');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.error?.message || 'Error de conexión con el servidor');
        error.codigo = data?.error?.code;
        throw error;
    }
    return data;
}
