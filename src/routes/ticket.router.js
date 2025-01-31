import { Router } from 'express';
import TicketRepository from '../repositories/ticket.repository.js';
import CartRepository from '../repositories/cart.repository.js';
import ProductRepository from '../repositories/product.repository.js';

const router = Router();

const ticketRepository = new TicketRepository();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

router.post('/purchase/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartRepository.getById(cartId);
    
    // Verificar stock
    for (const item of cart.products) {
        const product = await productRepository.getById(item.product);
        if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
        }
    }

    // Generar el ticket
    const total = cart.products.reduce((sum, item) => {
        const product = productRepository.getById(item.product);
        return sum + product.price * item.quantity;
    }, 0);

    const ticketData = {
        code: generateTicketCode(),
        amount: total,
        purchaser: req.user._id,
    };

    const ticket = await ticketRepository.create(ticketData);

    // Eliminar productos comprados del carrito
    await cartRepository.clearPurchasedProducts(cartId, cart.products);

    res.json({ message: 'Compra realizada correctamente', ticket });
});

function generateTicketCode() {
    return 'TICKET-' + Date.now();
}

export default router;
