// src/routes/views.router.js
import { Router } from "express";

export default function viewsRouter(productManager) {
  const router = Router();

  router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
  });

  router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  });

  return router;
}
