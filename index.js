import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { sequelize, testConnection } from './src/config/database.js';

dotenv.config();

const app = express();

testConnection();

app.use(cors());
app.use(express.json()); 
app.use(cookieParser()); 

app.get('/', (req, res) => {
  res.send('¡Hola, mundo! El servidor está funcionando.');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});