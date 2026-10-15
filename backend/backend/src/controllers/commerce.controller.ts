import type { Request, Response } from 'express';
import config from '../config/env.config';

// Interface pour représenter un commerce
interface Commerce {
  id: number;
  nom: string;
  slogan?: string;
  logoUrl?: string;
  bannerUrl?: string;
  bannerText?: string;
  couleurPrincipale: string;
  whatsappNumero: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  horaires?: string;
  devise?: string;
  symboleDevise?: string;
  messageAccueil?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Stockage en mémoire pour la démonstration (à remplacer par la vraie base de données)
let commerces: Commerce[] = [];

/**
 * Vérifie si une couleur a un contraste suffisant avec le blanc (ratio >= 4.5:1)
 * Cette version simplifiée sert pour la démonstration.
 * En production, nous utiliserions une bibliothèque de couleurs dédiée.
 * @param hexColor - Couleur hexadécimale à vérifier
 * @returns true si le contraste est suffisant, false sinon
 */
const isContrastSufficient = (hexColor: string): boolean => {
  // Implémentation simplifiée pour la démonstration
  // En production, nous utiliserions la fonction meetsContrastStandard de color.utils.ts
  // avec le blanc (#FFFFFF) comme deuxième couleur
  
  // Quelques vérifications basiques pour éviter les couleurs trop claires
  if (!/^#[0-9A-F]{6}$/i.test(hexColor)) {
    return false;
  }
  
  // Extraire les composantes RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  
  // Conversion approximative en luminance (formule simplifiée)
  // Pour une vérification précise, nous utiliserions la fonction getLuminance de color.utils.ts
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Le blanc a une luminance de 1.0
  // Pour un contraste de 4.5:1 avec le blanc, nous avons besoin d'une luminance <= 0.35 environ
  // Formule simplifiée: contraste ≈ (L1 + 0.05) / (L2 + 0.05)
  // Où L1 est la luminance la plus claire et L2 la plus sombre
  // Avec du blanc (L2 = 1), nous voulons: (L1 + 0.05) / (1 + 0.05) >= 4.5
  // Donc: L1 >= 4.5 * 1.05 - 0.05 = 4.675
  // Mais comme L1 <= 1, cette formule directe ne marche pas - nous avons inversé
  // En réalité, pour du texte sur fond blanc, c'est la luminance du texte qui compte
  // Nous voulons: (1 + 0.05) / (Ltexte + 0.05) >= 4.5
  // Donc: Ltexte <= (1.05 / 4.5) - 0.05 = 0.1833
  
  return luminance <= 0.1833;
};

/**
 * Récupère les paramètres du commerce pour l'utilisateur connecté
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

    // Trouver le commerce associé à l'utilisateur
    // Dans une vraie application, nous ferions une jointure via l'utilisateur
    // Pour la démonstration, nous retournons le premier commerce
    const commerce = commerces[0];
    
    if (!commerce) {
      res.status(404).json({ 
        message: 'Commerce non trouvé.' 
      });
      return;
    }

    // Retourner les paramètres du commerce (sans informations sensibles)
    res.status(200).json({
      id: commerce.id,
      nom: commerce.nom,
      slogan: commerce.slogan,
      logoUrl: commerce.logoUrl,
      bannerUrl: commerce.bannerUrl,
      bannerText: commerce.bannerText,
      couleurPrincipale: commerce.couleurPrincipale,
      whatsappNumero: commerce.whatsappNumero,
      telephone: commerce.telephone,
      email: commerce.email,
      adresse: commerce.adresse,
      horaires: commerce.horaires,
      devise: commerce.devise,
      symboleDevise: commerce.symboleDevise,
      messageAccueil: commerce.messageAccueil
    });
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

    // Dans une vraie application, nous trouverions le commerce associé à l'utilisateur
    // Pour la démonstration, nous travaillons sur le premier commerce
    let commerce = commerces[0];
    
    if (!commerce) {
      // Si aucun commerce n'existe, nous en créons un nouveau (cas de l'inscription)
      commerce = {
        id: 1,
        nom: '',
        slogan: '',
        logoUrl: undefined,
        bannerUrl: undefined,
        bannerText: undefined,
        couleurPrincipale: '#1F3A5F', // Couleur par défaut
        whatsappNumero: '',
        telephone: '',
        email: '',
        adresse: '',
        horaires: '',
        devise: 'XOF',
        symboleDevie: 'FCFA',
        messageAccueil: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      commerces.push(commerce);
    }

    // Mettre à jour les champs fournis
    const {
      nom,
      slogan,
      logoUrl,
      bannerUrl,
      bannerText,
      couleurPrincipale,
      whatsappNumero,
      telephone,
      email,
      adresse,
      horaires,
      devise,
      symboleDevise,
      messageAccueil
    } = req.body;

    // Validation basique
    if (nom !== undefined && (nom.length < 2 || nom.length > 60)) {
      res.status(400).json({ 
        message: 'Le nom du commerce doit contenir entre 2 et 60 caractères.' 
      });
      return;
    }

    if (slogan !== undefined && slogan.length > 100) {
      res.status(400).json({ 
        message: 'Le slogan ne doit pas dépasser 100 caractères.' 
      });
      return;
    }

    if (whatsappNumero !== undefined) {
      // Validation du numéro WhatsApp (RG-03)
      const whatsappRegex = /^[0-9]{8,15}$/;
      if (!whatsappRegex.test(whatsappNumero)) {
        res.status(400).json({ 
          message: 'Le numéro WhatsApp doit contenir entre 8 et 15 chiffres uniquement.' 
        });
        return;
      }
    }

    if (couleurPrincipale !== undefined) {
      // Validation de la couleur principale (RG-16)
      const isValidHex = /^#[0-9A-F]{6}$/i.test(couleurPrincipale);
      if (!isValidHex) {
        res.status(400).json({ 
          message: 'La couleur principale doit être un code hexadécimal valide (ex: #1F3A5F).' 
        });
        return;
      }

      // Vérification du contraste avec le blanc (ratio minimum 4.5:1)
      // En production, nous utiliserions l'utilitaire color.utils.ts
      if (!isContrastSufficient(couleurPrincipale)) {
        // Si le contraste est insuffisant, nous revenons à la couleur par défaut
        console.warn(`Contraste insuffisant pour la couleur ${couleurPrincipale}, retour à la couleur par défaut`);
        commerce.couleurPrincipale = '#1F3A5F'; // Couleur par défaut bleu nuit
        // Nous continuons quand même avec la mise à jour, mais en utilisant la couleur par défaut
        // Alternative: nous pourrions retourner une erreur ici
      } else {
        commerce.couleurPrincipale = couleurPrincipale;
      }
    }

    // Mettre à jour les champs
    commerce.nom = nom !== undefined ? nom : commerce.nom;
    commerce.slogan = slogan !== undefined ? slogan : commerce.slogan;
    commerce.logoUrl = logoUrl !== undefined ? logoUrl : commerce.logoUrl;
    commerce.bannerUrl = bannerUrl !== undefined ? bannerUrl : commerce.bannerUrl;
    commerce.bannerText = bannerText !== undefined ? bannerText : commerce.bannerText;
    commerce.whatsappNumero = whatsappNumero !== undefined ? whatsappNumero : commerce.whatsappNumero;
    commerce.telephone = telephone !== undefined ? telephone : commerce.telephone;
    commerce.email = email !== undefined ? email : commerce.email;
    commerce.adresse = adresse !== undefined ? adresse : commerce.adresse;
    commerce.horaires = horaires !== undefined ? horaires : commerce.horaires;
    commerce.devise = devise !== undefined ? devise : commerce.devise;
    commerce.symboleDevie = symboleDevise !== undefined ? symboleDevise : commerce.symboleDevie;
    commerce.messageAccueil = messageAccueil !== undefined ? messageAccueil : commerce.messageAccueil;
    commerce.updatedAt = new Date();

    // Retourner le commerce mis à jour
    res.status(200).json({
      id: commerce.id,
      nom: commerce.nom,
      slogan: commerce.slogan,
      logoUrl: commerce.logoUrl,
      bannerUrl: commerce.bannerUrl,
      bannerText: commerce.bannerText,
      couleurPrincipale: commerce.couleurPrincipale,
      whatsappNumero: commerce.whatsappNumero,
      telephone: commerce.telephone,
      email: commerce.email,
      adresse: commerce.adresse,
      horaires: commerce.horaires,
      devise: commerce.devise,
      symboleDevie: commerce.symboleDevie,
      messageAccueil: commerce.messageAccueil
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres du commerce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour des paramètres du commerce.' 
    });
  }
};

export default { getCommerce, updateCommerce };
