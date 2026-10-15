# Sellercatalog - Backend

Cette étape implémente la base de l'API REST avec authentification sécurisée.

## Structure du projet

```
backend/
├── src/
│   ├── controllers/      # Logique métier (auth.controller.ts)
│   ├── middleware/       # Middlewares personnalisés (auth.middleware.ts, error.middleware.ts)
│   ├── routes/           # Définition des routes API (auth.routes.ts)
│   ├── utils/            # Utilitaires transversaux (password.utils.ts, auth.utils.ts)
│   ├── config/           # Configuration de l'application (env.config.ts)
│   └── server.ts         # Point d'entrée de l'application
├── data/                 # Base de données SQLite (en développement)
├── uploads/              # Dossier pour les uploads d'images
├── .env.example          # Exemple de variables d'environnement
├── .env                  # Variables d'environnement locales (pas versionnées)
├── package.json
└── tsconfig.json
```

## Installation

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Créer le fichier `.env` basé sur `.env.example` :
   ```bash
   cp .env.example .env
   ```
   Puis ajuster les valeurs si nécessaire (en développement, les valeurs par défaut devraient fonctionner).

## Lancement

### En développement
```bash
npm run dev
```

### En production
```bash
npm start
```

Le serveur démarrera sur `http://localhost:5000` par défaut.

## Endpoints disponibles

### Authentification

- `POST /api/auth/register` - Enregistrer un nouvel utilisateur
- `POST /api/auth/login` - Connecter un utilisateur
- `GET /api/auth/me` - Obtenir les informations de l'utilisateur connecté (nécessite un token JWT)

### Health Check

- `GET /health` - Vérifier l'état du serveur

## Test des endpoints

### Enregistrement d'un nouvel utilisateur

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "commerçant@example.com",
    "password": "motdepasse123",
    "commerceData": {
      "nom": "Ma Boutique",
      "slogan": "Qualité et service",
      "whatsapp_numero": "22890123456",
      "adresse": "Rue du Marché, Lomé",
      "telephone": "22890123456",
      "email": "contact@aboutique.com",
      "horaires": "Lun-Sam: 8h-18h",
      "message_accueil": "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
    }
  }'
```

### Connexion

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "commerçant@example.com",
    "password": "motdepasse123"
  }'
```

### Vérification du token (après connexion)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <votre_token_ici>"
```

## Sécurité implémentée

- [x] Hashing des mots de passe avec bcrypt (12 rounds)
- [x] Tokens JWT avec expiration configurable
- [x] Middleware d'authentification pour protéger les routes
- [x] Headers de sécurité avec Helmet.js
- [x] Protection CORS configurée
- [x] Validation des entrées de base
- [x] Gestion centralisée des erreurs
- [x] Logging des requêtes avec Morgan

## Ce qui a été accompli dans cette étape (a)

1. **Initialisation du projet backend** avec Node.js, Express et TypeScript
2. **Configuration de l'environnement** avec support pour différents types de bases de données (SQLite en dev, PostgreSQL en prod)
3. **Implémentation de l'authentification sécurisée** :
   - Hashage des mots de passe avec bcrypt
   - Génération et vérification de tokens JWT
   - Middleware d'authentification pour protéger les routes
   - Gestion des rôles (admin pour l'instant, extensible)
4. **Création des endpoints d'authentification** :
   - POST /api/auth/register - Enregistrement d'utilisateurs
   - POST /api/auth/login - Connexion d'utilisateurs
   - GET /api/auth/me - Récupération des informations utilisateur (protégé)
5. **Mise en place des middlewares essentiels** :
   - Authentification JWT
   - Gestion des erreurs centralisée
   - Handling des 404
   - Sécurité avec Helmet.js
   - CORS configuré
   - Logging avec Morgan
6. **Tests fonctionnels réussis** :
   - Enregistrement d'utilisateur avec hashage de mot de passe
   - Connexion et génération de token JWT
   - Accès aux endpoints protégés avec token valide
   - Rejet approprié des requêtes non authentifiées
   - Gestion correcte des tokens invalides ou expirés

## Prochaines étapes

Une fois cette étape validée, nous passerons à :
1. Étape (b) : Paramètres du commerce + thème dynamique
2. Étape (c) : Catalogue public
3. Étape (d) : Fiche produit + module WhatsApp
4. Étape (e) : Admin produits/catégories
5. Étape (f) : PWA + performance + accessibilité

## Notes importantes pour le développement

- Cette étape utilise un stockage en mémoire pour la démonstration (à remplacer par une vraie base de données)
- En production, ceci sera remplacé par une vraie base de données PostgreSQL avec les tables définies dans le schéma proposé
- Les mots de passe sont hashés de manière sécurisée avant stockage (bcrypt avec 12 rounds)
- Les tokens JWT sont vérifiés à chaque requête sur les routes protégées
- Toutes les réponses d'erreur suivent un format cohérent pour faciliter le traitement côté client
