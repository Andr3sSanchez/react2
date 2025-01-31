import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { connectDB } from './database.js';
import initializePassport from './src/config/passport.js';
import productsRouter from './src/routes/products.router.js';
import cartRouter from './src/routes/carts.router.js';
import usersRouter from './src/routes/users.router.js';
import sessionRouter from './src/routes/session.router.js';
import ticketRouter from './src/routes/ticket.router.js';
import expressSession from 'express-session';


const app = express();
const PORT = process.env.PORT || 9090;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/tickets', ticketRouter);

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
