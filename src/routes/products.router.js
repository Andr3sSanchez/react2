import { Router } from 'express';
import Product from '../models/product.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/authorization.js';

const router = Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Solo los ADMIN pueden agregar, actualizar o eliminar productos
router.post('/', authenticateJWT, authorizeRole(['admin']), async (req, res) => {
    try {
      const newProduct = await Product.create(req.body);
      res.status(201).json({ message: 'Producto creado', product: newProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.put('/:id', authenticateJWT, authorizeRole(['admin']), async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json({ message: 'Producto actualizado', product: updatedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.delete('/:id', authenticateJWT, authorizeRole(['admin']), async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
