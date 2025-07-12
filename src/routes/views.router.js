// src/routes/views.router.js
import { Router } from "express";

export default function viewsRouter(productManager) {
  const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filtro = {};
    if (query) {
      if (query === "disponibles") {
        filtro.stock = { $gt: 0 };
      } else {
        filtro.category = query;
      }
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
      lean: true
    };

    const result = await productManager.paginate(filtro, options);

    res.render("home", {
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      query,
      sort,
      limit
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});


  router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  });

  return router;
}
