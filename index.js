// index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { sequelize, testConnection } from './src/config/database.js';
import './src/models/associations.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import tagRoutes from './src/routes/tag.routes.js';
import articleRoutes from './src/routes/article.routes.js';
import articleTagRoutes from './src/routes/articleTag.routes.js';

dotenv.config();

const app = express();

testConnection();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/articles-tags', articleTagRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola, mundo! El servidor está funcionando.');
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Sincronizar la base de datos y LUEGO iniciar el servidor
sequelize.sync({ force: false }).then(() => {
  console.log('Base de datos y tablas sincronizadas.');
  // El servidor solo se inicia si la sincronización fue exitosa
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(error => {
  console.error('No se pudo sincronizar la base de datos:', error);
});