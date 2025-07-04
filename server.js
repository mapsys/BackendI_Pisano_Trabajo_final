import express from "express";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";
import ProductManager from "./src/managers/productManager.js";
import CartManager from "./src/managers/cartManager.js";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import { Server } from "socket.io";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, "src/data");

// COnfiguro express y Socket.IO
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;
const productManager = await ProductManager.crear(dataPath);
const cartManager = await CartManager.crear(dataPath);

// Configuro Handlebars
const hbs = exphbs.create({
  helpers: {
    firstThumbnail: (thumbnails) => (thumbnails && thumbnails.length > 0 ? thumbnails[0] : "/img/no-image.png"),
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "src/views"));

// Configuro Static
app.use(express.static(join(__dirname, "src/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuro mongoose

// Rutas
app.use("/api/products", productsRouter(productManager));
app.use("/api/carts", cartsRouter(cartManager, productManager));
app.use("/", viewsRouter(productManager));

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.emit("products", productManager.getProducts());

  socket.on("addProduct", async (productData) => {
    try {
      await productManager.addProduct(productData.description, productData.price, productData.thumbnail, productData.title, productData.code, productData.stock);
      io.emit("products", productManager.getProducts());
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await productManager.deleteProduct(Number(id));
      io.emit("products", productManager.getProducts());
    } catch (error) {
      socket.emit("error", error.message);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
