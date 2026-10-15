import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import commerceRoutes from './routes/commerce.routes';
import config from './config/env.config';
import { errorHandler, notFound } from './middleware/error.middleware';

// Charger les variables d'environnement
dotenv.config();

// Créer l'instance Express
const app = express();

// Middlewares de sécurité et de base
app.use(helmet());                           // En-têtes de sécurité HTTP
app.use(cors({                               // Configuration CORS
  origin: config.corsOrigin,
  credentials: true
}));
app.use(morgan('dev'));                      // Logging des requêtes
app.use(express.json({ limit: '10mb' }));    // Parser le corps des requêtes JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parser les données urlencoded

// Route de santé (health check)
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'sellercatalog-backend',
    version: '1.0.0'
  });
});

// Enregistrement des routes API
app.use('/api/auth', authRoutes);
app.use('/api/commerce', commerceRoutes);
// Ici seront ajoutées les autres routes (produits, catégories, etc.)
// app.use('/api/produits', produitRoutes);
// app.use('/api/categories', categorieRoutes);

// Gestion des 404 - doit venir après toutes les routes définies
app.use(notFound);

// Gestion centralisée des erreurs - doit venir en dernier
app.use(errorHandler);

// Démarrage du serveur
const startServer = async () => {
  try {
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 API Auth: http://localhost:${PORT}/api/auth`);
      console.log(`🏪 API Commerce: http://localhost:${PORT}/api/commerce`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}

export default app;
