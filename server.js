import express from "express";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";
// import ProductManager from "./src/managers/productManager.js";
import ProductManager from "./src/managers/productManagerMongo.js";
import CartManager from "./src/managers/cartManager.js";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, "src/data");

// Configuro express y Socket.IO
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;
// const productManager = await ProductManager.crear(dataPath);
const productManager = new ProductManager();
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
mongoose
  .connect("mongodb+srv://mapsys2007:phut5lE2TWOCoru7@cluster0.jammggy.mongodb.net/tienda?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Conexión a MongoDB exitosa");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

// Rutas
app.use("/api/products", productsRouter(productManager));
app.use("/api/carts", cartsRouter(cartManager, productManager));
app.use("/", viewsRouter(productManager));

// WebSocket connection
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  (async () => {
    const products = await productManager.getProducts();
    socket.emit("products", products);
  })();

  socket.on("addProduct", (productData) => {
    (async () => {
      try {
        await productManager.addProduct(productData.description, productData.price, productData.thumbnail, productData.title, productData.code, productData.stock);
        const updatedProducts = await productManager.getProducts();
        io.emit("products", updatedProducts);
      } catch (error) {
        socket.emit("error", error.message);
      }
    })();
  });
  socket.on("deleteProduct", (id) => {
    productManager
      .deleteProduct(id)
      .then(() => productManager.getProducts())
      .then((updatedProducts) => {
        io.emit("products", updatedProducts);
      })
      .catch((error) => {
        socket.emit("error", error.message);
      });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
