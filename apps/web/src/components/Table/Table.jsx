import './Table.css';

// columnas: [{ clave, titulo, render?: (fila) => nodo, className? }]
export default function Table({
    columnas,
    filas,
    claveFila = 'id',
    descripcion,
    vacio = 'No hay datos para mostrar.',
    }) {
    return (
        <div className="table-wrap" role="region" aria-label={descripcion} tabIndex={0}>
        <table className="table">
            {descripcion && <caption className="sr-only">{descripcion}</caption>}
            <thead>
            <tr>
                {columnas.map((columna) => (
                <th key={columna.clave} scope="col" className={columna.className}>
                    {columna.titulo}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {filas.length === 0 ? (
                <tr>
                <td className="table__empty" colSpan={columnas.length}>
                    {vacio}
                </td>
                </tr>
            ) : (
                filas.map((fila) => (
                <tr key={fila[claveFila]}>
                    {columnas.map((columna) => (
                    <td key={columna.clave} className={columna.className}>
                        {columna.render ? columna.render(fila) : (fila[columna.clave] ?? '—')}
                    </td>
                    ))}
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    );
}