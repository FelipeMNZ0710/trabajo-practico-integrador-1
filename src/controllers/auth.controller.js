import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.helper.js';
import { generateToken } from '../helpers/jwt.helper.js';
import { sequelize } from '../config/database.js';

/**
 * Controlador para registrar un nuevo usuario.
 */
export const register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { username, email, password, first_name, last_name } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    }, { transaction: t });
    await Profile.create({
      user_id: newUser.id,
      first_name: first_name || 'Nombre',
      last_name: last_name || 'Apellido'
    }, { transaction: t });
    await t.commit();
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email o el nombre de usuario ya existen.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al registrar el usuario.', error: error.message });
  }
};

/**
 * Controlador para iniciar sesión de un usuario.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const payload = { id: user.id, role: user.role };
    const token = generateToken(payload);
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000
    });
    res.status(200).json({ message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para obtener el perfil del usuario autenticado.
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userWithProfile = await User.findByPk(userId, {
      include: [{
        model: Profile,
        as: 'profile'
      }]
    });
    if (!userWithProfile) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(userWithProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para actualizar el perfil del usuario autenticado.
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, biography, birth_date, avatar_url } = req.body;
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado.' });
    }
    await profile.update({
      first_name,
      last_name,
      biography,
      birth_date,
      avatar_url
    });
    res.status(200).json({ message: 'Perfil actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al actualizar el perfil.', error: error.message });
  }
};

/**
 * Controlador para cerrar la sesión de un usuario.
 */
export const logout = (req, res) => {
  try {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al cerrar la sesión.' });
  }
};