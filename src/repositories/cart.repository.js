import CartDAO from '../dao/cart.dao.js';

export default class CartRepository {
    constructor() {
        this.dao = new CartDAO();
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async create(cartData) {
        return await this.dao.create(cartData);
    }

    async addProduct(cartId, productId, quantity) {
        const cart = await this.getById(cartId);
        const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }
    

    async removeProduct(cartId, productId) {
        const cart = await this.getById(cartId);
        cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
        return await cart.save();
    }

    async clearPurchasedProducts(cartId, purchasedProducts) {
        const cart = await this.getById(cartId);
        cart.products = cart.products.filter(item =>
            !purchasedProducts.some(p => p.product.toString() === item.product.toString())
        );
        return await cart.save();
    }
}

