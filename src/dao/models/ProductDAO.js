import ProductModel from "../models/product.js";

class ProductDAO {
  async getAll(filters = {}, options = {}) {
    return await ProductModel.paginate(filters, options);
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }

  async update(id, productData) {
    return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductDAO();
