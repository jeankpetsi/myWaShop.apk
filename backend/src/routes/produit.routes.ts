import { Router } from 'express';
import produitController from '../controllers/produit.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Toutes ces routes nécessitent une authentification
router.use(authenticate);

// Route pour récupérer les produits avec recherche, filtres, tri et pagination
router.get('/', produitController.getProduits);

// Route pour récupérer un produit spécifique par son slug
router.get('/:slug', produitController.getProduitBySlug);

// Route pour créer un nouveau produit
router.post('/', produitController.createProduit);

// Route pour mettre à jour un produit existant
router.put('/:id', produitController.updateProduit);

// Route pour supprimer un produit (le masquer)
router.delete('/:id', produitController.deleteProduit);

export default router;
