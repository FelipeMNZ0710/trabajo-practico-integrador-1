/**
 * Función que crea un middleware para verificar la propiedad de un recurso.
 * También permite el acceso si el usuario es administrador.
 * @param {import('sequelize').ModelCtor<any>} Model - El modelo de Sequelize a verificar (ej: Article).
 */
export const ownerMiddleware = (Model) => {
  return async (req, res, next) => {
    const user = req.user;

    const resourceId = req.params.id;

    if (!user || !resourceId) {
      return res.status(400).json({ message: 'Información insuficiente para la validación de propiedad.' });
    }

    try {
      if (user.role === 'admin') {
        return next(); 
      }

      const resource = await Model.findByPk(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Recurso no encontrado.' });
      }
      if (resource.user_id && resource.user_id === user.id) {
        next();
      } else {
        res.status(403).json({ message: 'Acceso denegado. No eres el propietario de este recurso.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor al verificar la propiedad.' });
    }
  };
};