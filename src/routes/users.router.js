import { Router } from 'express';
import User from '../models/user.js';

const router = Router();

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el usuario',
      error: error.message,
    });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({
        message: 'No hay usuarios registrados',
      });
    }
    res.json({
      message: 'Usuarios obtenidos correctamente',
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener los usuarios',
      error: error.message,
    });
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }
    res.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el usuario',
      error: error.message,
    });
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }
    res.json({
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el usuario',
      error: error.message,
    });
  }
});

export default router;
