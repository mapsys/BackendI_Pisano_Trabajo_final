// src/routes/carts.router.js
import { Router } from "express";

export default function cartsRouter(cartManager, productManager) {
  const router = Router();

  router.post("/", async (req, res) => {    
    try {
      const newCart = await cartManager.addCart();
      res.status(201).json(newCart);
    } catch {
      res.status(500).json({ error: "Error al crear el carrito en el router" });
    }
  });

  router.post("/:cid/products/:pid", async (req, res) => {
    const { qty } = req.body;
    const { cid, pid } = req.params;

    try {
      await productManager.hasProductStock(pid, qty);
      const cart = await cartManager.addProductToCart(cid, pid, qty);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  router.get("/:id", async (req, res) => { 
    const { id } = req.params;
    try {
      const cart = await cartManager.getCartById(id);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  });

  router.get("/:cid/totales", async (req, res) => {
    const { cid } = req.params;
    try {
      const totales = await cartManager.calcularTotales(cid);
      res.status(200).json(totales);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los carritos" });
    }
  });

  return router;
}
