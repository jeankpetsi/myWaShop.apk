import { Router } from 'express';
import type { Request, Response } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Route publique pour l'inscription
router.post('/register', authController.register);

// Route publique pour la connexion
router.post('/login', authController.login);

// Route protégée pour obtenir les informations de l'utilisateur connecté
router.get('/me', authenticate, authController.me);

export default router;
