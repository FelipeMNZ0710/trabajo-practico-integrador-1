import User from '../models/User.js';
import Profile from '../models/Profile.js';

/**
 * Controlador para obtener todos los usuarios (solo para admins).
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Profile,
        as: 'profile'
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para obtener un usuario específico por su ID (solo para admins).
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [
        { model: Profile, as: 'profile' },
      ]
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para actualizar un usuario por su ID (solo para admins).
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    await user.update({ username, email, role });
    res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email o el nombre de usuario ya están en uso.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para eliminar lógicamente un usuario por su ID (solo para admins).
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado (lógicamente) exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};