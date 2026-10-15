import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token dans l'en-tête Authorization
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Récupérer le token depuis l'en-tête Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ 
      message: 'Accès non autorisé. Token manquant.' 
    });
    return;
  }

  // Le token doit être au format "Bearer <token>"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ 
      message: 'Format du token invalide. Utilisez Authorization: Bearer <token>' 
    });
    return;
  }

  const token = parts[1];
  
  if (!token) {
    res.status(401).json({ 
      message: 'Token manquant.' 
    });
    return;
  }

  // Vérifier le token
  const payload = verifyToken(token);
  
  if (!payload) {
    res.status(401).json({ 
      message: 'Token invalide ou expiré.' 
    });
    return;
  }

  // Attacher les informations de l'utilisateur à la requête pour les utiliser dans les contrôleurs
  (req as any).user = payload;
  
  // Passer au middleware suivant ou au contrôleur
  next();
};

/**
 * Middleware pour vérifier les rôles autorisés
 * @param allowedRoles - Tableau des rôles autorisés à accéder à la route
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    
    if (!user) {
      res.status(401).json({ 
        message: 'Accès non autorisé. Utilisateur non authentifié.' 
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ 
        message: 'Accès interdit. Privilèges insuffisants.' 
      });
      return;
    }

    next();
  };
};

export default { authenticate, authorize };
