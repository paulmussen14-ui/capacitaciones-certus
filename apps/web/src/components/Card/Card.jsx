import './Card.css';

export default function Card({ titulo, acciones, children, className = '' }) {
    return (
        <section className={`card ${className}`.trim()}>
        {(titulo || acciones) && (
            <header className="card__header">
            {titulo && <h2 className="card__title">{titulo}</h2>}
            {acciones && <div className="card__actions">{acciones}</div>}
            </header>
        )}
        <div className="card__body">{children}</div>
        </section>
    );
}