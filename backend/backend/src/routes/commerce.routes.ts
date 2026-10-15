import { Router } from 'express';
import commerceController from '../controllers/commerce.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Toutes ces routes nécessitent une authentification
router.use(authenticate);

// Route pour récupérer les paramètres du commerce
router.get('/', commerceController.getCommerce);

// Route pour mettre à jour les paramètres du commerce
router.put('/', commerceController.updateCommerce);

export default router;
