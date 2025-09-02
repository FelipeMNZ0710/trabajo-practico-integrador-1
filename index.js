import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { sequelize, testConnection } from './src/config/database.js';

import './src/models/associations.js';

import authRoutes from './src/routes/auth.routes.js';

dotenv.config();

const app = express();

testConnection();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola, mundo! El servidor está funcionando.');
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log('Base de datos y tablas sincronizadas.');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(error => {
  console.error('No se pudo sincronizar la base de datos:', error);
});