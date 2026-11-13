import './BarraProgreso.css';

export default function BarraProgreso({ valor }) {
    return (
        <div className="barra" role="img" aria-label={`${valor}% de progreso`}>
        <div className="barra__relleno" style={{ width: `${valor}%` }} />
        </div>
    );
}
