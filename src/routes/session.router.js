import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/user.repository.js';
import { generateToken } from '../utils/jwt.util.js';
import passport from 'passport';
import UserDTO from '../dto/user.dto.js'; // Asegúrate de que la ruta sea correcta
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();
const userRepository = new UserRepository();

// 📌 **Login**
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      if (req.cookies.token) {
        // Eliminar el token viejo
        res.clearCookie('token');
    }

    const user = await userRepository.findByEmail(email);
    if (!user || !user.isValidPassword(password)) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 **Obtener usuario autenticado**
router.get('/current', authenticateJWT, (req, res) => {
  const { id, role, email } = req.user; // Aquí extraemos los datos del usuario
  res.json({ id, role, email }); // Retornamos los datos necesarios
});
export default router;
