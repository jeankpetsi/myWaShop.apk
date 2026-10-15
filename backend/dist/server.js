"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const commerce_routes_1 = __importDefault(require("./routes/commerce.routes"));
const categorie_routes_1 = __importDefault(require("./routes/categorie.routes"));
const produit_routes_1 = __importDefault(require("./routes/produit.routes"));
const env_config_1 = __importDefault(require("./config/env.config"));
const error_middleware_1 = require("./middleware/error.middleware");
// Charger les variables d'environnement
dotenv_1.default.config();
// Créer l'instance Express
const app = (0, express_1.default)();
// Middlewares de sécurité et de base
app.use((0, helmet_1.default)()); // En-têtes de sécurité HTTP
app.use((0, cors_1.default)({
    origin: env_config_1.default.corsOrigin,
    credentials: true
}));
app.use((0, morgan_1.default)('dev')); // Logging des requêtes
app.use(express_1.default.json({ limit: '10mb' })); // Parser le corps des requêtes JSON
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' })); // Parser les données urlencoded
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
app.use('/api/auth', auth_routes_1.default);
app.use('/api/commerce', commerce_routes_1.default);
app.use('/api/categories', categorie_routes_1.default);
app.use('/api/produits', produit_routes_1.default);
// Ici seront ajoutées les autres routes (images, variantes, admin, etc.)
// app.use('/api/images', imageRoutes);
// app.use('/api/variantes', varianteRoutes);
// app.use('/api/admin', adminRoutes);
// Gestion des 404 - doit venir après toutes les routes définies
app.use(error_middleware_1.notFound);
// Gestion centralisée des erreurs - doit venir en dernier
app.use(error_middleware_1.errorHandler);
// Démarrage du serveur
const startServer = async () => {
    try {
        const PORT = env_config_1.default.port;
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📝 Environment: ${env_config_1.default.nodeEnv}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`🔐 API Auth: http://localhost:${PORT}/api/auth`);
            console.log(`🏪 API Commerce: http://localhost:${PORT}/api/commerce`);
            console.log(`📂 API Categories: http://localhost:${PORT}/api/categories`);
            console.log(`📦 API Produits: http://localhost:${PORT}/api/produits`);
        });
    }
    catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};
// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
    startServer();
}
exports.default = app;
