const botonesAgregar = document.querySelectorAll(".producto-agregar");

function configurarCategorias() {
  const linksCategorias = document.querySelectorAll(".boton-categoria");
  const linkVolver = document.querySelector(".boton-volver");

  linksCategorias.forEach((link) => {
    link.classList.remove("disable");
  });

  if (linkVolver) {
    linkVolver.classList.add("disable");
  }
}

async function configBotonAgregar(event) {
  const carritoContenedor = document.getElementById("carrito-contenido");
  const numeritoCarrito = document.getElementById("numerito");
  const carritoCantidad = document.getElementById("carrito-contenido-cantidad");
  const carritoTotal = document.getElementById("carrito-contenido-precio");
  const linkCarrito = document.getElementById("boton-carrito");
  const total = document.querySelector("#carrito-total");
  const productId = event.currentTarget.dataset.id;
  let cartId = localStorage.getItem("cartId");
  if (!cartId) {
    // Si no hay carrito, creamos uno nuevo
    try {
      const cartRes = await fetch("/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const cartData = await cartRes.json();
      cartId = cartData._id;
      localStorage.setItem("cartId", cartId);
    } catch (err) {
      alert("Error al crear el carrito", err);
      return;
    }
  }
  // Actualizamos el número de productos en el carrito o agregamos uno nuevo
  // Tambien actualizamos los totales del carrito
  try {
    const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: 1 }),
    });

    const data = await res.json();

    if (res.ok) {
      Toastify({
        text: "Producto agregado al carrito",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "#28a745",
      }).showToast();
      // Actualizamos el número de productos en el carrito
      try {
        const res = await fetch(`/api/carts/${cartId}/totales`);
        const totales = await res.json();
        numeritoCarrito.textContent = totales.totalCantidad;
        carritoCantidad.textContent = totales.totalCantidad;
        carritoTotal.textContent = totales.totalPrecio;
        carritoContenedor.classList.remove("disable");
        linkCarrito.href = `/carts/${cartId}`;
      } catch (err) {
        console.error("Error al obtener los totales del carrito:", err);
        alert("Error al actualizar el carrito");
      }
    } else {
      alert(data.error || "Error al agregar");
    }
  } catch (err) {
    alert("Error en la solicitud");
  }
}

async function estadoInicial(cartId) {
  const carritoContenedor = document.getElementById("carrito-contenido");
  const numeritoCarrito = document.getElementById("numerito");
  const carritoCantidad = document.getElementById("carrito-contenido-cantidad");
  const carritoTotal = document.getElementById("carrito-contenido-precio");
  const linkCarrito = document.getElementById("boton-carrito");
  if (cartId) {
    linkCarrito.href = `/carts/${cartId}`;
    try {
      const res = await fetch(`/api/carts/${cartId}/totales`);
      if (res.ok) {
        const totales = await res.json();
        // 👀 Mostrar el contenedor si estaba oculto
        if (totales.totalCantidad > 0) {
          carritoContenedor.classList.remove("disable");
        }
        if (numeritoCarrito) numeritoCarrito.textContent = totales.totalCantidad;
        if (carritoCantidad) carritoCantidad.textContent = totales.totalCantidad;
        if (carritoTotal) carritoTotal.textContent = `$${totales.totalPrecio}`;
      }
    } catch (err) {
      console.error("Error al cargar los totales del carrito al iniciar:", err);
    }
  }
}

function updateQuery() {
  const params = new URLSearchParams(window.location.search);
  const limitSelect = document.getElementById("limit");
  const sortSelect = document.getElementById("sort");
  if (limitSelect) {
    params.set("limit", limitSelect.value);
  }
  if (sortSelect) {
    params.set("sort", sortSelect.value);
  }

  // Recargamos la URL con los nuevos parámetros
  window.location.search = params.toString();
}
async function main() {
  console.log("Cargando home.js");
  configurarCategorias();
  const cartId = localStorage.getItem("cartId");
  await estadoInicial(cartId);
  const botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach((boton) => boton.addEventListener("click", configBotonAgregar));
  // Manejo de filtros
  const limitSelect = document.getElementById("limit");
  const sortSelect = document.getElementById("sort");

  limitSelect.addEventListener("change", updateQuery);
  sortSelect.addEventListener("change", updateQuery);

  const params = new URLSearchParams(window.location.search);

  if (limitSelect && params.get("limit")) {
    limitSelect.value = params.get("limit");
  }

  if (sortSelect && params.get("sort")) {
    sortSelect.value = params.get("sort");
  }
}


main().catch((err) => {
  console.error("Error en home.js:", err);
});
