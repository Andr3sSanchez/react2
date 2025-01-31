import { Router } from 'express';
import ProductRepository from '../repositories/product.repository.js';
import ProductDTO from '../dto/product.dto.js';
import { authorizeRoles } from '../middleware/auth.middleware.js';




const router = Router();
const productRepository = new ProductRepository();

// 📌 **Obtener productos con paginación y filtros**
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;
        const products = await productRepository.getAll({ page, limit, category, sort });
        res.json({ message: 'Productos obtenidos', products: products.map(p => new ProductDTO(p)) });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

// 📌 **Obtener producto por ID**
router.get('/:id', async (req, res) => {
    try {
        const product = await productRepository.getById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(new ProductDTO(product));
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
});

// 📌 **Crear producto**
router.post('/', authorizeRoles('admin'), async (req, res) => {
    try {
        const newProduct = await productRepository.create(req.body);
        res.status(201).json({ message: 'Producto creado', product: new ProductDTO(newProduct) });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
});

// 📌 **Actualizar producto**
router.put('/:id', authorizeRoles('admin'), async (req, res) => {
    try {
        const updatedProduct = await productRepository.update(req.params.id, req.body);
        if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto actualizado', product: new ProductDTO(updatedProduct) });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
    }
});

// 📌 **Eliminar producto**
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
    try {
        const deletedProduct = await productRepository.delete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
});

export default router;
