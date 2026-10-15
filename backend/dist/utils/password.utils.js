"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Hash un mot de passe de manière sécurisée
 * @param plainTextPassword - Le mot de passe en texte clair
 * @returns Promise contenant le hash du mot de passe
 */
const hashPassword = async (plainTextPassword) => {
    const saltRounds = 12; // Bon équilibre entre sécurité et performance
    return bcryptjs_1.default.hash(plainTextPassword, saltRounds);
};
exports.hashPassword = hashPassword;
/**
 * Compare un mot de passe en texte clair avec son hash
 * @param plainTextPassword - Le mot de passe en texte clair à vérifier
 * @param hashedPassword - Le hash stocké en base de données
 * @returns Promise contenant true si le mot de passe correspond, false sinon
 */
const comparePassword = async (plainTextPassword, hashedPassword) => {
    return bcryptjs_1.default.compare(plainTextPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
exports.default = { hashPassword: exports.hashPassword, comparePassword: exports.comparePassword };
