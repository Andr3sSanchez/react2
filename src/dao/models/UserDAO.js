import User from '../../models/user.js';

class UserDAO {
  // Crear un usuario en la base de datos
  async createUser(userData) {
    return await User.create(userData);
  }

  // Buscar un usuario por ID
  async getUserById(userId) {
    return await User.findById(userId);
  }

  // Buscar un usuario por email
  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  // Actualizar un usuario
  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  // Eliminar un usuario
  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    return await User.find();
  }
}

export default new UserDAO();
