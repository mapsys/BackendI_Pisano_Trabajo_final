import fs from "fs/promises";

const productos = await fs.readFile("./data/productos_original.json", "utf-8");
const productos2 = JSON.parse(productos);
console.log(productos2);
const newProductos = [];
let id = 1;
for (const producto of productos2) {
  delete producto.category;
  producto.code = producto.productRef;
  producto.id = id;
  id++;
  delete producto.productRef;
  producto.thumbnails = producto.pictures;
  delete producto.thumbnail;
  delete producto.pictures;
  producto.title = producto.name;
  producto.status = true;
  producto.stock = Math.floor(Math.random() * 100) + 1; // Genera un stock aleatorio entre 1 y 100
  newProductos.push(producto);
  if (id > 30) {
    break;
  }
}

await fs.writeFile("./data/productos.json", JSON.stringify(newProductos, null, 2));
console.log("Archivo actualizado con stock aleatorio");
