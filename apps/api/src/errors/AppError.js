export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR'){
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class NotFoundError extends AppError {
    constructor (message = 'Recurso no encontrado') {
        super(message, 404, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Datos invalidos') {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class UnauthorizedError extends AppError {
    constructor (message = 'No autenticado') {
        super(message, 401, 'UNAUTHORIZED')
    }
}

export class ForbiddenError extends AppError {
    constructor (message = 'No tienes permisos para esta accion') {
        super(message, 403, 'FORBIDDEN');
    }
}