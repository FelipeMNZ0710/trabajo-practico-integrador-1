import { Router } from 'express';
import { register, login, getProfile, updateProfile, logout } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// --- Rutas Públicas (no requieren token) ---
router.post('/register', register);
router.post('/login', login);

// Obtener el perfil del usuario autenticado
// Ruta: GET /api/auth/profile
router.get('/profile', authMiddleware, getProfile);

// Actualizar el perfil del usuario autenticado
// Ruta: PUT /api/auth/profile
router.put('/profile', authMiddleware, updateProfile);

// Cerrar la sesión del usuario
// Ruta: POST /api/auth/logout
router.post('/logout', authMiddleware, logout);

export default router;