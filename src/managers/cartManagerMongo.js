import Cart  from "../models/cart.model.js";

export default class CartManager {
  constructor() {
    // En Mongo ya no necesitas ruta ni manejo manual de ids
  }

  // Obtener todos los carritos
  async getCarts() {
    const carts = await Cart.find();
    return carts;
  }

  // Obtener carrito por _id
  async getCartById(id) {
    const cart = await Cart.findById(id);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    return cart;
  }

  // Crear un nuevo carrito vacío
  async addCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }

  // Agregar producto a carrito existente
  async addProductToCart(cartId, productId, qty) {
    if (!cartId || !productId || typeof qty !== "number" || qty <= 0) {
      throw new Error("Todos los campos son obligatorios y la cantidad debe ser mayor a 0");
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const productIndex = cart.products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      // Si ya existe, sumar la cantidad
      cart.products[productIndex].qty += qty;
    } else {
      // Si no existe, agregar al array
      cart.products.push({ id: productId, qty });
    }

    await cart.save();
    return cart;
  }
}
