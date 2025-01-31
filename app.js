import express from 'express';
import dotenv from 'dotenv'; // Cargar variables de entorno
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './database.js'; // Conexión a MongoDB
import './src/config/passport.js'; // Configuración de Passport
import sessionRouter from './src/routes/session.router.js';
import usersRouter from './src/routes/users.router.js';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize()); // Inicialización de Passport

// Rutas
app.use('/api/sessions', sessionRouter); // Ruta para sesiones
app.use('/api/users', usersRouter); // Ruta para usuarios
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Conectar a la base de datos y levantar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
