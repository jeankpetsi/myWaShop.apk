import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware de gestion des erreurs centralisé
 * Capture toutes les erreurs et les formate de manière cohérente
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({ 
    message: `Route non trouvée: ${req.method} ${req.originalUrl}` 
  });
};

export default { errorHandler, notFound };
