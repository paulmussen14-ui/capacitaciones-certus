export async function apiFetch(path, options = {}) {
    let response;
    try {
        response = await fetch(`/api${path}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options,
        });
    } catch {
        throw new Error('No se pudo conectar con el servidor');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.error?.message || 'Error de conexión con el servidor');
    }
    return data;
}