import type { Request, Response } from 'express';
import config from '../config/env.config';

// Interface pour représenter les paramètres du commerce
interface CommerceSettings {
  id: number;
  nom: string;
  slogan?: string;
  whatsappNumber: string;
  mainColor: string;
  texteAccueil?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Stockage en mémoire pour la démonstration (à remplacer par la vraie base de données)
let commerceSettings: CommerceSettings = {
  id: 1,
  nom: "Mon Commerce",
  slogan: "Qualité et service",
  whatsappNumber: "+228 90 00 00 00",
  mainColor: "#007bff",
  texteAccueil: "Bienvenue dans notre boutique en ligne !",
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * Valide un numéro de WhatsApp (RG-03)
 * @param number - Numéro de téléphone à valider
 * @returns true si le numéro est valide, false sinon
 */
const validateWhatsAppNumber = (number: string): boolean => {
  // Supprimer tous les caractères non numériques
  const digitsOnly = number.replace(/\D/g, '');

  // Vérifier la longueur (8 à 15 chiffres)
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return false;
  }

  // Vérifier que ça commence par un code pays valide (optionnel)
  // Pour simplifier, on accepte juste la longueur
  return true;
};

/**
 * Calcule la luminance d'une couleur hexadécimale (pour le contraste WCAG)
 * @param hex - Couleur hexadécimale (ex: #007bff)
 * @returns Luminance entre 0 et 1
 */
const getLuminance = (hex: string): number => {
  // Supprimer le # si présent
  const cleanHex = hex.replace('#', '');

  // Convertir en RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  // Appliquer la formule de luminance
  const rgb = [r, g, b].map(val => {
    return val <= 0.03928
      ? val / 12.92
      : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

/**
 * Calcule le ratio de contraste entre deux couleurs (WCAG)
 * @param hex1 - Première couleur hexadécimale
 * @param hex2 - Deuxième couleur hexadécimale
 * @returns Ratio de contraste (min: 1, max: 21)
 */
const getContrastRatio = (hex1: string, hex2: string): number => {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Vérifie si la couleur principale respecte le contraste WCAG AA (RG-16)
 * @param mainColor - Couleur principale en hexadécimal
 * @returns true si le contraste est suffisant, false sinon
 */
const validateColorContrast = (mainColor: string): boolean => {
  // Vérifier le contraste avec le blanc (texte sur fond coloré)
  const contrastWhite = getContrastRatio(mainColor, '#ffffff');
  // Vérifier le contraste avec le noir (texte sur fond coloré)
  const contrastBlack = getContrastRatio(mainColor, '#000000');

  // Pour WCAG AA, le contraste doit être d'au moins 4.5 pour le texte normal
  // ou 3 pour le texte en gros caractères
  // On vérifie les deux scénarios (texte blanc ou noir sur fond coloré)
  return contrastWhite >= 4.5 || contrastBlack >= 4.5;
};

/**
 * Récupère les paramètres du commerce
 * @route GET /api/commerce
 */
export const getCommerce = (req: Request, res: Response): void => {
  try {
    // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        message: 'Utilisateur non authentifié.'
      });
      return;
    }

    // Dans une vraie application, nous filtrerions par commerce_id via l'utilisateur
    // Pour la démonstration, nous retournons les paramètres du commerce unique

    res.status(200).json(commerceSettings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres du commerce:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des paramètres du commerce.'
    });
  }
};

/**
 * Met à jour les paramètres du commerce
 * @route PUT /api/commerce
 */
export const updateCommerce = async (req: Request, res: Response): Promise<void> => {
  try {
    // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        message: 'Utilisateur non authentifié.'
      });
      return;
    }

    // Gérer le cas où les valeurs pourraient être des tableaux
    const getValue = (value: string | string[] | undefined): string | undefined => {
      if (value === undefined) return undefined;
      return Array.isArray(value) ? value[0] : value;
    };

    const nom = getValue(req.body.nom);
    const slogan = getValue(req.body.slogan);
    const whatsappNumber = getValue(req.body.whatsappNumber);
    const mainColor = getValue(req.body.mainColor);
    const texteAccueil = getValue(req.body.texteAccueil);

    // Validation des champs fournis
    if (nom !== undefined && nom !== null) {
      if (typeof nom !== 'string' || nom.trim() === '') {
        res.status(400).json({
          message: 'Le nom du commerce ne peut pas être vide.'
        });
        return;
      }

      if (nom.length < 2 || nom.length > 60) {
        res.status(400).json({
          message: 'Le nom du commerce doit contenir entre 2 et 60 caractères.'
        });
        return;
      }
    }

    if (slogan !== undefined && slogan !== null) {
      if (typeof slogan !== 'string') {
        res.status(400).json({
          message: 'Le slogan doit être une chaîne de caractères.'
        });
        return;
      }

      if (slogan.length > 100) {
        res.status(400).json({
          message: 'Le slogan doit contenir au maximum 100 caractères.'
        });
        return;
      }
    }

    if (whatsappNumber !== undefined && whatsappNumber !== null) {
      if (typeof whatsappNumber !== 'string') {
        res.status(400).json({
          message: 'Le numéro de WhatsApp doit être une chaîne de caractères.'
        });
        return;
      }

      if (!validateWhatsAppNumber(whatsappNumber)) {
        res.status(400).json({
          message: 'Le numéro de WhatsApp doit contenir entre 8 et 15 chiffres.'
        });
        return;
      }
    }

    if (mainColor !== undefined && mainColor !== null) {
      if (typeof mainColor !== 'string') {
        res.status(400).json({
          message: 'La couleur principale doit être une chaîne de caractères.'
        });
        return;
      }

      // Validation du format de couleur hexadécimale
      if (!/^#[0-9A-F]{6}$/i.test(mainColor)) {
        res.status(400).json({
          message: 'La couleur principale doit être au format hexadécimal (ex: #007bff).'
        });
        return;
      }

      // Vérification du contraste RG-16
      if (!validateColorContrast(mainColor)) {
        res.status(400).json({
          message: 'La couleur principale doit offrir un contraste suffisant pour assurer la lisibilité (WCAG AA).'
        });
        return;
      }
    }

    if (texteAccueil !== undefined && texteAccueil !== null) {
      if (typeof texteAccueil !== 'string') {
        res.status(400).json({
          message: 'Le texte d\'accueil doit être une chaîne de caractères.'
        });
        return;
      }

      if (texteAccueil.length > 500) {
        res.status(400).json({
          message: 'Le texte d\'accueil doit contenir au maximum 500 caractères.'
        });
        return;
      }
    }

    // Mettre à jour les champs
    if (nom !== undefined && nom !== null) {
      commerceSettings.nom = nom.trim();
    }

    if (slogan !== undefined && slogan !== null) {
      commerceSettings.slogan = slogan.trim();
    }

    if (whatsappNumber !== undefined && whatsappNumber !== null) {
      commerceSettings.whatsappNumber = whatsappNumber.trim();
    }

    if (mainColor !== undefined && mainColor !== null) {
      commerceSettings.mainColor = mainColor.trim();
    }

    if (texteAccueil !== undefined && texteAccueil !== null) {
      commerceSettings.texteAccueil = texteAccueil.trim();
    }

    commerceSettings.updatedAt = new Date();

    res.status(200).json(commerceSettings);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres du commerce:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour des paramètres du commerce.'
    });
  }
};

export default {
  getCommerce,
  updateCommerce
};