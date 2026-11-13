import { apiFetch } from './api';

export function obtenerMetricas() {
    return apiFetch('/metricas');
}
