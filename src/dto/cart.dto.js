export default class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price
        }));
    }
}
