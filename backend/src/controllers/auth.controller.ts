import type { Request, Response } from 'express';
import config from '../config/env.config';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/auth.utils';

// Interface pour représenter un utilisateur (à adapter quand on aura la vraie base de données)
interface User {
  id: number;
  email: string;
  password: string; // hashé
  role: string;
  commerceId: number;
}

// En attendant la vraie base de données, on utilise un stockage en mémoire pour la démonstration
// Dans une vraie application, ceci serait remplacé par des requêtes à la base de données
let users: User[] = [];

// Conteneur pour stocker les commerces (à remplacer par la vraie base de données)
let commerces: any[] = [];

/**
 * Enregistre un nouvel utilisateur et son commerce associé
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, commerceData } = req.body;

    // Validation basique des données d'entrée
    if (!email || !password || !commerceData) {
      res.status(400).json({ 
        message: 'Email, mot de passe et données du commerce sont requis.' 
      });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      res.status(409).json({ 
        message: 'Un compte avec cet email existe déjà.' 
      });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer le commerce (en attendant la vraie base de données)
    const commerce = {
      id: commerces.length + 1,
      ...commerceData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    commerces.push(commerce);

    // Créer l'utilisateur
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      role: 'admin', // Par défaut, le premier utilisateur est un admin
      commerceId: commerce.id
    };
    users.push(user);

    // Générer le token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Retourner la réponse (sans le mot de passe)
    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        commerceId: user.commerceId
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'inscription de l\'utilisateur.' 
    });
  }
};

/**
 * Connecte un utilisateur et retourne un token JWT
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation basique
    if (!email || !password) {
      res.status(400).json({ 
        message: 'Email et mot de passe sont requis.' 
      });
      return;
    }

    // Trouver l'utilisateur par email
    const user = users.find(user => user.email === email);
    if (!user) {
      res.status(401).json({ 
        message: 'Identifiants invalides.' 
      });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ 
        message: 'Identifiants invalides.' 
      });
      return;
    }

    // Générer le token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Retourner la réponse
    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        commerceId: user.commerceId
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la connexion.' 
    });
  }
};

/**
 * Retourne les informations de l'utilisateur connecté (pour vérifier le token)
 * @route GET /api/auth/me
 */
export const me = (req: Request, res: Response): void => {
  // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
  const user = (req as any).user;
  
  if (!user) {
    res.status(401).json({ 
      message: 'Utilisateur non authentifié.' 
    });
    return;
  }

  // Trouver l'utilisateur complet dans notre stockage en mémoire
  const fullUser = users.find(u => u.id === user.id);
  if (!fullUser) {
    res.status(404).json({ 
      message: 'Utilisateur non trouvé.' 
    });
    return;
  }

  // Trouver le commerce associé
  const commerce = commerces.find(c => c.id === fullUser.commerceId);

  res.status(200).json({
    user: {
      id: fullUser.id,
      email: fullUser.email,
      role: fullUser.role,
      commerceId: fullUser.commerceId
    },
    commerce: commerce ? {
      id: commerce.id,
      nom: commerce.nom,
      slogan: commerce.slogan,
      whatsappNumero: commerce.whatsapp_numero
    } : null
  });
};

export default { register, login, me };
