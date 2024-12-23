import jwt from 'jsonwebtoken';

// Función para generar el token JWT
export const generateToken = (user) => {
  // Aquí utilizamos JWT_SECRET que debe estar en el archivo .env
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Middleware para validar el token JWT
export const authToken = (req, res, next) => {
  // Extraer el token de las cookies
  const token = req.cookies.token;

  // Si no hay token, devolver error 401
  if (!token) return res.status(401).send({ error: "Not authenticated" });

  // Verificar el token usando la clave secreta del .env
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) return res.status(403).send({ error: "Not authorized" });

    // Agregar la información del usuario decodificada al objeto request
    req.user = decoded;
    next(); // Continuar con el siguiente middleware o ruta
  });
};
