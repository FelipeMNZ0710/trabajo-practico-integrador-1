import Article from '../models/Article.js';
import User from '../models/User.js';

/**
 * Controlador para crear un nuevo artículo.
 */
export const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;
    const userId = req.user.id;
    const newArticle = await Article.create({
      title,
      content,
      excerpt,
      status,
      user_id: userId
    });
    res.status(201).json({ message: 'Artículo creado exitosamente.', article: newArticle });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al crear el artículo.', error: error.message });
  }
};

/**
 * Controlador para listar todos los artículos que están publicados.
 */
export const getAllPublishedArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { status: 'published' },
      include: {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para obtener un artículo por su ID.
 */
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({
      where: {
        id: id,
        status: 'published'
      },
      include: {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      }
    });
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado o no está publicado.' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para listar todos los artículos del usuario logueado.
 */
export const getMyArticles = async (req, res) => {
  try {
    const userId = req.user.id;
    const articles = await Article.findAll({
      where: { user_id: userId }
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para obtener un artículo específico del usuario logueado por su ID.
 */
export const getMyArticleById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const article = await Article.findOne({
      where: {
        id: id,
        user_id: userId
      }
    });
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado o no te pertenece.' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para actualizar un artículo.
 */
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, status } = req.body;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado.' });
    }
    await article.update({ title, content, excerpt, status });
    res.status(200).json({ message: 'Artículo actualizado exitosamente.', article });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para eliminar (lógicamente) un artículo.
 */
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado.' });
    }
    await article.destroy();
    res.status(200).json({ message: 'Artículo eliminado (lógicamente) exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};