"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../config/env.config"));
/**
 * Génère un token JWT pour un utilisateur
 * @param payload - Les données à inclure dans le token
 * @returns Le token JWT signé
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_config_1.default.jwtSecret, {
        expiresIn: env_config_1.default.jwtExpiresIn
    });
};
exports.generateToken = generateToken;
/**
 * Vérifie un token JWT et retourne son payload s'il est valide
 * @param token - Le token JWT à vérifier
 * @returns Le payload décodé si le token est valide, null sinon
 */
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.default.jwtSecret);
        // Le décodé sera de type quelconque, mais nous savons qu'il a les propriétés dont nous avons besoin
        const tokenPayload = decoded;
        return {
            id: tokenPayload.id,
            email: tokenPayload.email,
            role: tokenPayload.role
        };
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
exports.default = { generateToken: exports.generateToken, verifyToken: exports.verifyToken };
