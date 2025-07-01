// src/routes/products.router.js
import { Router } from "express";

export default function productsRouter(productManager) {
  const router = Router();

  router.get("/", (req, res) => {
    const products = productManager.getProducts();
    res.status(200).json(products);
  });

  router.get("/:id", (req, res) => {
    const { id } = req.params;
    try {
      const product = productManager.getProductById(Number(id));
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  router.post("/", async (req, res) => {
    const { description, price, thumbnail, title, code, stock } = req.body;
    try {
      const newProduct = await productManager.addProduct(description, price, thumbnail, title, code, stock);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;
    try {
      const updatedProduct = await productManager.updateProduct(Number(id), updatedFields);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await productManager.deleteProduct(Number(id));
      res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  return router;
}
