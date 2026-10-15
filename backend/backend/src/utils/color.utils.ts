/**
 * Convertit une couleur hexadécimale en valeurs RGB
 * @param hex - Couleur hexadécimale (ex: #1F3A5F)
 * @returns Objet contenant les valeurs r, g, b (0-255) ou null si invalide
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  // Supprimer le # si présent
  const cleanHex = hex.replace('#', '');
  
  // Vérifier que c'est bien un hexadécimal de 6 chiffres
  if (!/^[0-9A-F]{6}$/i.test(cleanHex)) {
    return null;
  }
  
  // Convertir en décimal
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return { r, g, b };
};

/**
 * Calcule la luminance relative d'une couleur selon la formule WCAG
 * @param r - Valeur rouge (0-255)
 * @param g - Valeur verte (0-255)
 * @param b - Valeur bleue (0-255)
 * @returns Luminance relative (0-1)
 */
export const getLuminance = (r: number, g: number, b: number): number => {
  // Convertir de sRGB linéaire
  const [rs, gs, bs] = [r, g, b].map(val => {
    const normalized = val / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  
  // Formule de luminance relative WCAG
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calcule le ratio de contraste entre deux couleurs selon WCAG
 * @param hex1 - Première couleur hexadécimale
 * @param hex2 - Deuxième couleur hexadécimale
 * @returns Ratio de contraste (1-21) ou null si les couleurs sont invalides
 */
export const getContrastRatio = (hex1: string, hex2: string): number | null => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  if (!rgb1 || !rgb2) {
    return null;
  }
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  // S'assurer que lum1 est la plus claire
  const [lighter, darker] = lum1 > lum2 ? [lum1, lum2] : [lum2, lum1];
  
  // Formule de contraste WCAG
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Vérifie si le contraste entre deux couleurs respecte le seuil minimum WCAG AA
 * @param hex1 - Première couleur hexadécimale
 * @param hex2 - Deuxième couleur hexadécimale
 * @param minimumRatio - Ratio minimum recommandé (défaut: 4.5 pour texte normal)
 * @returns true si le contraste suffit, false sinon
 */
export const meetsContrastStandard = (
  hex1: string, 
  hex2: string, 
  minimumRatio: number = 4.5
): boolean => {
  const ratio = getContrastRatio(hex1, hex2);
  return ratio !== null && ratio >= minimumRatio;
};

export default { 
  hexToRgb, 
  getLuminance, 
  getContrastRatio, 
  meetsContrastStandard 
};
