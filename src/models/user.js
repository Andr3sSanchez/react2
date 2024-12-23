import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Definir el esquema del modelo User
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' },
});

// Encriptar la contraseña antes de guardarla
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10); // Encriptar contraseña
  next();
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password); // Comparar contraseñas
};

export default mongoose.model('User', userSchema);
