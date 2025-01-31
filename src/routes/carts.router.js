import { Router } from 'express';
import CartRepository from '../repositories/cart.repository.js';
import CartDTO from '../dto/cart.dto.js';

const router = Router();
const cartRepository = new CartRepository();

// 📌 **Obtener carrito por ID**
router.get('/:id', async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.id);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.json(new CartDTO(cart));
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
});

// Agregar producto al carrito
router.post('/:id/products/:productId', async (req, res) => {
  const { quantity } = req.body;
  const product = await productRepository.getById(req.params.productId);

  if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Stock insuficiente' });
  }

  const updatedCart = await cartRepository.addProduct(req.params.id, req.params.productId, quantity);
  res.json({ message: 'Producto agregado', cart: new CartDTO(updatedCart) });
});


// 📌 **Eliminar producto del carrito**
router.delete('/:id/products/:productId', async (req, res) => {
    try {
        const updatedCart = await cartRepository.removeProduct(req.params.id, req.params.productId);
        res.json({ message: 'Producto eliminado', cart: new CartDTO(updatedCart) });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});

export default router;
