import mongoose from "mongoose";

const productInCartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  products: { type: [productInCartSchema], default: [] },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
