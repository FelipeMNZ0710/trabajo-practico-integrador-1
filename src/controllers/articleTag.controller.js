import ArticleTag from '../models/ArticleTag.js';
import Article from '../models/Article.js';
import Tag from '../models/Tag.js';

/**
 * Controlador para agregar una etiqueta a un artículo.
 */
export const addTagToArticle = async (req, res) => {
  try {
    const { article_id, tag_id } = req.body;
    const user = req.user; // Obtenido del authMiddleware

    // 1. Verificar que el artículo y la etiqueta existen
    const article = await Article.findByPk(article_id);
    const tag = await Tag.findByPk(tag_id);

    if (!article || !tag) {
      return res.status(404).json({ message: 'Artículo o etiqueta no encontrados.' });
    }

    // 2. Control de Seguridad: Verificar que el usuario es el dueño del artículo (o es admin)
    if (user.role !== 'admin' && article.user_id !== user.id) {
      return res.status(403).json({ message: 'Acceso denegado. No eres el propietario de este artículo.' });
    }

    // 3. Crear la asociación en la tabla intermedia
    const newAssociation = await ArticleTag.create({ article_id, tag_id });
    
    res.status(201).json({ message: 'Etiqueta agregada al artículo exitosamente.', association: newAssociation });

  } catch (error) {
    // Manejar el caso de que la asociación ya exista (error de clave única compuesta)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Esta etiqueta ya está asociada a este artículo.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * Controlador para remover una etiqueta de un artículo.
 */
export const removeTagFromArticle = async (req, res) => {
  try {
    const { articleTagId } = req.params; // ID de la ASOCIACIÓN, no del artículo ni de la etiqueta
    const user = req.user;

    // 1. Encontrar la asociación que se quiere borrar
    const association = await ArticleTag.findByPk(articleTagId);
    if (!association) {
      return res.status(404).json({ message: 'Asociación no encontrada.' });
    }

    // 2. A través de la asociación, encontrar el artículo para verificar la propiedad
    const article = await Article.findByPk(association.article_id);
    
    // 3. Control de Seguridad: Verificar que el usuario es el dueño del artículo (o es admin)
    if (user.role !== 'admin' && article.user_id !== user.id) {
      return res.status(403).json({ message: 'Acceso denegado. No eres el propietario de este artículo.' });
    }

    // 4. Eliminar la asociación
    await association.destroy();

    res.status(200).json({ message: 'Etiqueta removida del artículo exitosamente.' });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};