import './Badge.css';

export default function Badge({ tono = 'neutral', children }) {
    return <span className={`badge badge--${tono}`}>{children}</span>;
}