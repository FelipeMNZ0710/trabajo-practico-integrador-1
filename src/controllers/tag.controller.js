import Tag from '../models/Tag.js';
import Article from '../models/Article.js';

/**
 * Controlador para crear una nueva etiqueta (solo para admins).
 */
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const newTag = await Tag.create({ name });
    res.status(201).json({ message: 'Etiqueta creada exitosamente.', tag: newTag });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El nombre de la etiqueta ya existe.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para obtener todas las etiquetas (para usuarios autenticados).
 */
export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para obtener una etiqueta específica por su ID (solo para admins).
 */
export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id, {
      include: {
        model: Article,
        as: 'articles'
      }
    });
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada.' });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para actualizar una etiqueta por su ID (solo para admins).
 */
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada.' });
    }
    await tag.update({ name });
    res.status(200).json({ message: 'Etiqueta actualizada exitosamente.' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El nombre de la etiqueta ya existe.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para eliminar una etiqueta por su ID (solo para admins).
 */
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada.' });
    }
    await tag.destroy();
    res.status(200).json({ message: 'Etiqueta eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};