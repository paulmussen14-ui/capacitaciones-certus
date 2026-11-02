import './Alert.css';

export default function Alert({ tono = 'error', children, accion }) {
    return (
        <div className={`alert alert--${tono}`} role={tono === 'error' ? 'alert' : 'status'}>
        <span>{children}</span>
        {accion}
        </div>
    );
}