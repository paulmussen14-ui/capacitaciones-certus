import './Avatar.css';

export default function Avatar({ nombres = '', apellidos = '', src, size = 'md' }) {
    const iniciales = `${nombres.trim()[0] ?? ''}${apellidos.trim()[0] ?? ''}`.toUpperCase();

    return src ? (
        <img className={`avatar avatar--${size}`} src={src} alt="" loading="lazy" />
    ) : (
        <span className={`avatar avatar--${size} avatar--iniciales`} aria-hidden="true">
        {iniciales || '?'}
        </span>
    );
}
