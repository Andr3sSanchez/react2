export default class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.category = product.category;
        this.stock = product.stock;
    }
}
