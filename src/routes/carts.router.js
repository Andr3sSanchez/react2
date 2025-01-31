import { Router } from 'express';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import Ticket from '../models/ticket.js';
import { sendPurchaseEmail } from '../utils/mailer.js';
import { authorizeRole } from '../middleware/authorization.js';


const router = Router();

// Obtener el carrito del usuario
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Solo los USUARIOS pueden agregar productos al carrito
router.post('/:cid/product/:pid', authenticateJWT, authorizeRole(['user']), async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const product = await Product.findById(req.params.pid);

    if (!cart || !product) return res.status(404).json({ error: 'Carrito o producto no encontrado' });

    const existingItem = cart.products.find(item => item.product.equals(product._id));

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.products.push({ product: product._id, quantity: 1 });
    }

    await cart.save();
    res.json({ message: 'Producto agregado al carrito', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto del carrito
router.delete('/remove/:productId', authenticateJWT, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = cart.products.filter(item => item.product.toString() !== req.params.productId);

    await cart.save();
    res.json({ message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Vaciar el carrito
router.delete('/clear', authenticateJWT, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();
    res.json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
});

// Solo los USUARIOS pueden finalizar compras
router.post('/checkout', authenticateJWT, authorizeRole(['user']), async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart || cart.products.length === 0) return res.status(400).json({ error: 'Carrito vacío' });

    let totalAmount = 0;
    cart.products.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    const ticket = new Ticket({
      user: req.user.id,
      products: cart.products.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount
    });

    await ticket.save();
    await sendPurchaseEmail(req.user.email, ticket);

    cart.products = [];
    await cart.save();

    res.json({ message: 'Compra finalizada. Revisa tu correo.', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
});

export default router;
