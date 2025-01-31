import ProductDAO from '../dao/product.dao.js';

export default class ProductRepository {
    constructor() {
        this.dao = new ProductDAO();
    }

    async getAll({ page = 1, limit = 10, category, sort }) {
        const query = {};
        if (category) query.category = category;

        const options = {
            page,
            limit,
            sort: sort ? { price: sort } : {},
        };

        return await this.dao.getAll(query, options);
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async create(productData) {
        return await this.dao.create(productData);
    }
}
