import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Base de données
  dbType: process.env.DB_TYPE || 'sqlite',
  sqliteDbPath: process.env.SQLITE_DB_PATH || './data/app.db',
  
  // PostgreSQL (pour la production)
  pgHost: process.env.PG_HOST || 'localhost',
  pgPort: parseInt(process.env.PG_PORT || '5432', 10),
  pgUsername: process.env.PG_USERNAME || 'postgres',
  pgPassword: process.env.PG_PASSWORD || '',
  pgDatabase: process.env.PG_DATABASE || 'sellercatalog',
  
  // Upload d'images
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  allowedMimeTypes: (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};

export default config;
