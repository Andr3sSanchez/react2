import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import passport from 'passport';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isValidPassword(password)) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userDTO = {
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    role: req.user.role,
  };
  res.json({ user: userDTO });
});

export default router;
