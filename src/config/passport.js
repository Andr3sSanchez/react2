import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/user.repository.js';  // Asegurarte de importar el repositorio correcto
import dotenv from 'dotenv';

dotenv.config();

// Instanciar el repositorio
const userRepository = new UserRepository();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

export default function initializePassport() {
    passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            // Usar findByEmail si estás pasando el email en el payload del JWT
            const user = await userRepository.findByEmail(jwt_payload.email); 
            if (user) return done(null, user);
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await userRepository.findByEmail(username);  
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });

            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userRepository.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}
