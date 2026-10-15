import { Router } from 'express';
import categorieController from '../controllers/categorie.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Toutes ces routes nécessitent une authentification
router.use(authenticate);

// Route pour récupérer toutes les catégories
router.get('/', categorieController.getCategories);

// Route pour récupérer une catégorie spécifique
router.get('/:id', categorieController.getCategorieById);

// Route pour créer une nouvelle catégorie
router.post('/', categorieController.createCategorie);

// Route pour mettre à jour une catégorie existante
router.put('/:id', categorieController.updateCategorie);

// Route pour supprimer une catégorie
router.delete('/:id', categorieController.deleteCategorie);

export default router;