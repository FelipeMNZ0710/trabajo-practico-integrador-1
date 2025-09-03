// src/routes/auth.routes.js
import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator
} from '../validators/auth.validator.js';

const router = Router();

// --- Rutas Públicas ---
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// --- Rutas Protegidas ---
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', [authMiddleware, updateProfileValidator], updateProfile);
router.post('/logout', authMiddleware, logout);

export default router;