"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produit_controller_1 = __importDefault(require("../controllers/produit.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Toutes ces routes nécessitent une authentification
router.use(auth_middleware_1.authenticate);
// Route pour récupérer les produits avec recherche, filtres, tri et pagination
router.get('/', produit_controller_1.default.getProduits);
// Route pour récupérer un produit spécifique par son slug
router.get('/:slug', produit_controller_1.default.getProduitBySlug);
// Route pour créer un nouveau produit
router.post('/', produit_controller_1.default.createProduit);
// Route pour mettre à jour un produit existant
router.put('/:id', produit_controller_1.default.updateProduit);
// Route pour supprimer un produit (le masquer)
router.delete('/:id', produit_controller_1.default.deleteProduit);
exports.default = router;
