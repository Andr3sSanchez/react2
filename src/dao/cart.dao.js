import CartModel from '../models/cart.model.js';

export default class CartDAO {
    async getById(id) {
        return await CartModel.findById(id).populate('products.product');
    }
    async create(cartData) {
        return await CartModel.create(cartData);
    }
}
