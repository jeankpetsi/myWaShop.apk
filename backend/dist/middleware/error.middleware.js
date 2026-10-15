"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
/**
 * Middleware de gestion des erreurs centralisé
 * Capture toutes les erreurs et les formate de manière cohérente
 */
const errorHandler = (err, req, res, next) => {
    console.error('Erreur capturée par le middleware:', err);
    // Déterminer le code de statut HTTP
    const statusCode = err.status || 500;
    // Préparer la réponse d'erreur
    const errorResponse = {
        message: err.message || 'Une erreur interne est survenue.',
        // En environnement de développement, inclure plus de détails
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details
        })
    };
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
/**
 * Middleware pour gérer les routes non trouvées (404)
 */
const notFound = (req, res, next) => {
    res.status(404).json({
        message: `Route non trouvée: ${req.method} ${req.originalUrl}`
    });
};
exports.notFound = notFound;
exports.default = { errorHandler: exports.errorHandler, notFound: exports.notFound };
