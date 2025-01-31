import ProductModel from '../models/product.model.js';

export default class ProductDAO {
    async getAll(query = {}, options = {}) {
        return await ProductModel.paginate(query, options);
    }

    async getById(id) {
        return await ProductModel.findById(id);
    }

    async create(productData) {
        return await ProductModel.create(productData);
    }
}
