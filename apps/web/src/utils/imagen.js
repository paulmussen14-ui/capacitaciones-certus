// Aplica lo que el administrador decidió con la imagen: subir una nueva o quitar la actual
export async function aplicarCambioImagen(cambio, id, subir, quitar) {
    if (!cambio) return;
    if (cambio.archivo) await subir(id, cambio.archivo);
    else if (cambio.quitar) await quitar(id);
}
