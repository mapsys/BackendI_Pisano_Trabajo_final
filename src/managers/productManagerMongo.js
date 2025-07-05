import Producto from "../models/producto.model.js";

export default class ProductManagerMongo {
  constructor() {}

  async getProducts() {
    const productos = await Producto.find().lean();
    return productos;
  }

  async addProduct(description, price, thumbnail, title, code, stock) {
    if (!description || !price || !title || !code || stock === undefined) {
      throw new Error("Todos los campos son obligatorios");
    }
    if (typeof price !== "number" || price <= 0) {
      throw new Error("El precio debe ser un número positivo");
    }
    if (typeof stock !== "number" || stock < 0) {
      throw new Error("El stock debe ser un número no negativo");
    }
    const exists = await Producto.findOne({ code });
    if (exists) {
      throw new Error("El código del producto debe ser único");
    }
    const newProduct = new Producto({
      description,
      price,
      thumbnails: [thumbnail],
      title,
      code,
      stock,
      status: stock > 0,
    });
    await newProduct.save();
    return newProduct;
  }

  async getProductByCode(code) {
    const product = await Producto.findOne({ code: code });
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async updateProduct(code, updatedFields) {
    const product = await Producto.findOneAndUpdate(
      { code: code }, // filtro por campo code
      updatedFields,
      { new: true } // devuelve el documento actualizado
    );

    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async deleteProduct(id) {
    console.log("eliminando", id);
    const product = await Producto.findByIdAndDelete(id);
    if (!product) {
      console.log("no se encontro el producto", id);
      throw new Error("Producto no encontrado");
    }
    console.log("producto eliminado", product);
    return product;
  }

  async hasProductStock(id, qty) {
    const product = await Producto.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    if (!product.status || product.stock < qty) {
      throw new Error("No hay suficiente stock");
    }
    return true;
  }
}
