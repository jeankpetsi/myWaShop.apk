import bcrypt from 'bcryptjs';

/**
 * Hash un mot de passe de manière sécurisée
 * @param plainTextPassword - Le mot de passe en texte clair
 * @returns Promise contenant le hash du mot de passe
 */
export const hashPassword = async (plainTextPassword: string): Promise<string> => {
  const saltRounds = 12; // Bon équilibre entre sécurité et performance
  return bcrypt.hash(plainTextPassword, saltRounds);
};

/**
 * Compare un mot de passe en texte clair avec son hash
 * @param plainTextPassword - Le mot de passe en texte clair à vérifier
 * @param hashedPassword - Le hash stocké en base de données
 * @returns Promise contenant true si le mot de passe correspond, false sinon
 */
export const comparePassword = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

export default { hashPassword, comparePassword };
