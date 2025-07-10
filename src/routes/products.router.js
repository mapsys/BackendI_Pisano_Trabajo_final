// src/routes/products.router.js
import { Router } from "express";

export default function productsRouter(productManager) {
  const router = Router();

  router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.status(200).json(products);
  });

  router.get("/:code", async (req, res) => {
    const { code } = req.params;
    try {
      const product = await productManager.getProductByCode(code);
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  router.post("/", async (req, res) => {
    const { description, price, thumbnail, title, code, stock } = req.body;
    if (!title || !description || !price || !code || !stock) {
      return res.status(400).json({ error: "Los campos Title, Description, Price, Code y Stock son obligatorios" });
    }
    try {
      const newProduct = await productManager.addProduct(description, price, thumbnail, title, code, stock);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put("/:code", async (req, res) => {
    const { code } = req.params;
    const updatedFields = req.body;
    try {
      const updatedProduct = await productManager.updateProduct(code, updatedFields);
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
