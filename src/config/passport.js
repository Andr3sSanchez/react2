import dotenv from 'dotenv'; 
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

// Configuración de la estrategia JWT
const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies?.token]), // Extraer el token desde las cookies
  secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey', // Usar JWT_SECRET desde el archivo .env, o una clave por defecto
};

// Configuración de la estrategia Passport para manejar JWT
passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      // Buscar el usuario en la base de datos usando el id que viene en el payload del JWT
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user); // Si el usuario existe, continuar con la autenticación
      } else {
        return done(null, false, { message: 'Usuario no encontrado' }); // Enviar mensaje de error
      }
    } catch (error) {
      return done(error, false, { message: 'Error al verificar el token' }); // Enviar mensaje de error
    }
  })
);

export default passport;
