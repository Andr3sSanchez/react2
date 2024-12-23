import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import passport from 'passport';

const router = Router();

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isValidPassword(password)) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de usuario actual
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

export default router;
