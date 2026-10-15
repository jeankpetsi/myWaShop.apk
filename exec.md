Pour exécuter l'application Catalogue Commercial Togo, suivez ces étapes :

Prérequis

- Node.js (version 18+ recommandée)
- npm (généralement fourni avec Node.js)
- Git (pour cloner le dépôt si nécessaire)

Installation et lancement

1. Backend (API Node.js/Express/TypeScript)

# Depuis la racine du projet

cd /home/jakk/Bureau/RepoPro/sellercatalog/backend

# Installer les dépendances (si ce n'est pas déjà fait)

npm install

# Compiler le TypeScript et démarrer le serveur

npm run build && npm start
Le backend sera accessible sur http://localhost:5000

2. Frontend (Application React/Vite/PWA)

# Depuis le répertoire frontend

cd /home/jakk/Bureau/RepoPro/sellercatalog/backend/frontend

# Installer les dépendances (si ce n'est pas déjà fait)

npm install

# Démarrer le serveur de développement

npm run dev
Le frontend sera accessible sur http://localhost:5173 (Vite ouvre généralement automatiquement cette adresse dans votre navigateur)

Accès à l'application

- Application publique : http://localhost:5173
- Page de connexion admin : http://localhost:5173/login
- Tableau de bord admin : http://localhost:5173/admin (après connexion)
- Documentation API : Les endpoints sont disponibles sous http://localhost:5000/api

Fonctionnalités clés à tester

1. Catalogue public :
   - Parcourir la liste des produits sur la page d'accueil
   - Utiliser la recherche (minimum 2 caractères)
   - Filtrer par catégorie
   - Trier par prix, date, etc.
   - Cliquer sur un produit pour voir sa fiche détaillée
   - Tester le bouton "Envoyer par WhatsApp" sur la fiche produit
2. Administration (nécessite de créer un compte d'abord) :
   - S'inscrire via /api/auth/register (endpoint backend) ou utiliser un compte prédéfini
   - Se connecter à la page /login
   - Gérer les produits (ajouter, modifier, supprimer) dans /admin/products
   - Gérer les catégories (ajouter, modifier, supprimer) dans /admin/categories
3. Fonctionnalités PWA :
   - L'application peut être installée comme application mobile/desktop via le navigateur
   - Fonctionne partiellement hors ligne grâce au service worker
   - Icône de lancement personnalisée

Notes importantes

- Le backend utilise une base de données en mémoire pour la démonstration (les données sont réinitialisées au redémarrage)
- En production, vous devriez configurer une base de données PostgreSQL réelle
- Les numéros de WhatsApp utilisés dans les exemples sont fictifs (+228 pour le Togo)
- Pour tester le contraste des couleurs (RG-16), modifiez la couleur principale dans les paramètres du commerce et observez les messages de validation

L'application respecte les spécifications du cahier des charges avec :

- Authentification JWT sécurisée
- Validation des données côté backend
- Interface responsive
- Compatibilité PWA
- Conformité WCAG 2.1 AA pour l'accessibilité
- Optimisations de performance (code splitting, mise en cache)

# "email":"test@example.com","password":"Test1234!","nom":"Test"
