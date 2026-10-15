"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorie_controller_1 = __importDefault(require("../controllers/categorie.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Toutes ces routes nécessitent une authentification
router.use(auth_middleware_1.authenticate);
// Route pour récupérer toutes les catégories
router.get('/', categorie_controller_1.default.getCategories);
// Route pour récupérer une catégorie spécifique
router.get('/:id', categorie_controller_1.default.getCategorieById);
// Route pour créer une nouvelle catégorie
router.post('/', categorie_controller_1.default.createCategorie);
// Route pour mettre à jour une catégorie existante
router.put('/:id', categorie_controller_1.default.updateCategorie);
// Route pour supprimer une catégorie
router.delete('/:id', categorie_controller_1.default.deleteCategorie);
exports.default = router;
