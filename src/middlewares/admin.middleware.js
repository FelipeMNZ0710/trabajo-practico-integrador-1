export const adminMiddleware = (req, res, next) => {
  const user = req.user;
  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};