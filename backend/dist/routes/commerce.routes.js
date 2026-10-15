"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commerce_controller_1 = __importDefault(require("../controllers/commerce.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Toutes ces routes nécessitent une authentification
router.use(auth_middleware_1.authenticate);
// Route pour récupérer les paramètres du commerce
router.get('/', commerce_controller_1.default.getCommerce);
// Route pour mettre à jour les paramètres du commerce
router.put('/', commerce_controller_1.default.updateCommerce);
exports.default = router;
