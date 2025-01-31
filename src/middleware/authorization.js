// Middleware para verificar si el usuario es admin
export const authorizeRole = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
  };
  