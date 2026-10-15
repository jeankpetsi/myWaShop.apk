import jwt from 'jsonwebtoken';
import config from '../config/env.config';

/**
 * Interface pour le payload du token JWT
 */
export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

/**
 * Génère un token JWT pour un utilisateur
 * @param payload - Les données à inclure dans le token
 * @returns Le token JWT signé
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { 
    expiresIn: config.jwtExpiresIn 
  } as jwt.SignOptions);
};

/**
 * Vérifie un token JWT et retourne son payload s'il est valide
 * @param token - Le token JWT à vérifier
 * @returns Le payload décodé si le token est valide, null sinon
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    // Le décodé sera de type quelconque, mais nous savons qu'il a les propriétés dont nous avons besoin
    const tokenPayload = decoded as TokenPayload;
    return {
      id: tokenPayload.id,
      email: tokenPayload.email,
      role: tokenPayload.role
    };
  } catch (error) {
    return null;
  }
};

export default { generateToken, verifyToken };
