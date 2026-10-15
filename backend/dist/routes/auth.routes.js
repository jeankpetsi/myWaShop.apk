"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Route publique pour l'inscription
router.post('/register', auth_controller_1.default.register);
// Route publique pour la connexion
router.post('/login', auth_controller_1.default.login);
// Route protégée pour obtenir les informations de l'utilisateur connecté
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.default.me);
exports.default = router;
