const socket = io();

// Actualizar lista de productos
socket.on("products", (products) => {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("div");
    li.classList.add("realtime-producto");
    li.innerHTML = `
              <img class="realtime-imagen" src="${product.thumbnails[0]}" alt="${product.title}" />
              <div class="realtime-producto-titulo">
                <small>Nombre</small>
                <h6>${product.title}</h6>
              </div>
              <div class="realtime-producto-precio">
                <small>Precio</small>
                <p>${product.price}</p>
              </div>
            <button data-id="${product.id}" class="delete-btn"><i class="bi bi-trash-fill"></i></button>
        `;
    list.appendChild(li);
  });
});

// Agregar producto
const form = document.getElementById("add-product-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: Number(document.getElementById("price").value),
    thumbnail: document.getElementById("thumbnail").value,
    code: document.getElementById("code").value,
    stock: Number(document.getElementById("stock").value),
  };
  socket.emit("addProduct", newProduct);
  form.reset();
});

// Eliminar producto
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      socket.emit("deleteProduct", id);
    }
  }
});
