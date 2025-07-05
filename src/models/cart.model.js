import mongoose from "mongoose";

const productInCartSchema = new mongoose.Schema({
  id: { type: String, required: true }, // ID del producto
  qty: { type: Number, required: true }, // Cantidad
});

const cartSchema = new mongoose.Schema({
  products: { type: [productInCartSchema], default: [] }, // Array de productos
});

// Exporto el modelo

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
