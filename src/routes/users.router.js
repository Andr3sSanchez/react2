import { Router } from 'express';
import UserRepository from '../repositories/user.repository.js';
import UserDTO from '../dto/user.dto.js';

const router = Router();
const userRepository = new UserRepository();

// 📌 **Crear usuario**
router.post('/', async (req, res) => {
    try {
        const newUser = await userRepository.create(req.body);
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: new UserDTO(newUser)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
});

// 📌 **Obtener todos los usuarios**
router.get('/', async (req, res) => {
    try {
        const users = await userRepository.getAll();
        if (users.length === 0) {
            return res.status(404).json({ message: 'No hay usuarios registrados' });
        }
        res.json({
            message: 'Usuarios obtenidos correctamente',
            users: users.map(user => new UserDTO(user))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
});

// 📌 **Actualizar usuario**
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await userRepository.update(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado exitosamente', user: new UserDTO(updatedUser) });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
});

// 📌 **Eliminar usuario**
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await userRepository.delete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
});

export default router;
