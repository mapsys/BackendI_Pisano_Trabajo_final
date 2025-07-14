document.addEventListener("DOMContentLoaded", async () => {
  const botones = document.querySelectorAll(".producto-agregar");
  const carritoContenedor = document.getElementById("carrito-contenido");
  const numeritoCarrito = document.getElementById("numerito");
  const carritoCantidad = document.getElementById("carrito-contenido-cantidad");
  const carritoTotal = document.getElementById("carrito-contenido-precio");
  const linkCarrito = document.getElementById("boton-carrito");
  const total = document.querySelector("#carrito-total");
  // manejo de los botones de categorias y seguir comprando
  const path = window.location.pathname;
  const esCarrito = path.startsWith("/carts/");

  const linksCategorias = document.querySelectorAll(".boton-categoria");
  const linkVolver = document.querySelector(".boton-volver");

  linksCategorias.forEach((link) => {
    if (esCarrito) {
      link.classList.add("disable");
    } else {
      link.classList.remove("disable");
    }
  });
  linksCategorias.forEach((boton) => {
    boton.addEventListener("click", () => {
      linksCategorias.forEach((b) => b.classList.remove("active")); // quitar clase a todos
      boton.classList.add("active"); // agregar clase solo al clickeado
    });
  });
  if (linkVolver) {
    if (esCarrito) {
      linkVolver.classList.remove("disable");
    } else {
      linkVolver.classList.add("disable");
    }
  }

  // Verifico si hay carrito al leer la pagina
  const cartId = localStorage.getItem("cartId");
  if (esCarrito && !cartId) {
    // Si no hay carrito en localStorage, y estás en la página de carrito, redirigí
    window.location.href = "/";
  }
  console.log("Carrito ID:", cartId);
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
  botones.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const productId = boton.dataset.id;
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
        const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
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
    });
  });

  // Eliminar producto
  const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        alert("No hay carrito para eliminar productos");
        return;
      }
      try {
        const res = await fetch(`/api/carts/${cartId}/products/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          Toastify({
            text: "Producto eliminado del carrito",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#dc3545",
          }).showToast();
          // Actualizamos el número de productos en el carrito
          const totalesRes = await fetch(`/api/carts/${cartId}/totales`);
          const totales = await totalesRes.json();
          numeritoCarrito.textContent = totales.totalCantidad;
          carritoCantidad.textContent = totales.totalCantidad;
          carritoTotal.textContent = totales.totalPrecio;
          location.reload();
          if (totales.totalCantidad === 0) {
            carritoContenedor.classList.add("disable");
            linkCarrito.href = "/carts";
          }
        } else {
          const data = await res.json();
          alert(data.error || "Error al eliminar");
        }
      } catch (err) {
        console.error("Error al eliminar el producto:", err);
        alert("Error en la solicitud");
      }
    });
  });

  // Vaciar Carrito
  const botonesVaciar = document.querySelectorAll("#carrito-acciones-vaciar");
  botonesVaciar.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        alert("No hay carrito para eliminar productos");
        return;
      }
      try {
        const res = await fetch(`/api/carts/${cartId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          Toastify({
            text: "Carrito vaciado",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#dc3545",
          }).showToast();
          // Actualizamos el número de productos en el carrito
          const totalesRes = await fetch(`/api/carts/${cartId}/totales`);
          const totales = await totalesRes.json();
          numeritoCarrito.textContent = totales.totalCantidad;
          carritoCantidad.textContent = totales.totalCantidad;
          carritoTotal.textContent = totales.totalPrecio;
          location.reload();
          // actualizo el estado del carrito
          try {
            const res = await fetch(`/api/carts/${cartId}/estado`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ estado: "inactivo" }),
            });
          } catch (error) {
            console.error("Error al actualizar el estado del carrito:", error);
          }
          localStorage.removeItem("cartId");
          if (totales.totalCantidad === 0) {
            carritoContenedor.classList.add("disable");
            linkCarrito.href = "/carts";
          }
        } else {
          const data = await res.json();
          alert(data.error || "Error al vaciar el carrito");
        }
      } catch (err) {
        console.error("Error al vacias:", err);
        alert("Error en la solicitud");
      }
    });
  });

  // Comprar Carrito
  const botonComprar = document.getElementById("carrito-acciones-comprar");
  if (botonComprar) {
    botonComprar.addEventListener("click", async () => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        alert("No hay carrito para comprar");
        return;
      }
      Swal.fire({
        title: "Finalizar compra?",
        text: `Tu compra asiende a ${total.innerText}
            Estas de acuerdo`,
        showDenyButton: true,
        confirmButtonText: "Finalizar Compra",
        denyButtonText: `Seguir comprando`,
        icon: "question",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Actualizamos el número de productos en el carrito
          const totalesRes = await fetch(`/api/carts/${cartId}/totales`);
          const totales = await totalesRes.json();
          numeritoCarrito.textContent = totales.totalCantidad;
          carritoCantidad.textContent = totales.totalCantidad;
          carritoTotal.textContent = totales.totalPrecio;
          // actualizo el estado del carrito
          try {
            const res = await fetch(`/api/carts/${cartId}/estado`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ estado: "comprado" }),
            });
          } catch (error) {
            console.error("Error al actualizar el estado del carrito:", error);
          }
          localStorage.removeItem("cartId");
          if (totales.totalCantidad === 0) {
            carritoContenedor.classList.add("disable");
            linkCarrito.href = "/carts";
          }
          location.reload();
          Swal.fire({
            title: "Compra Finalizada",
            text: "Gracias por tu compra",
            icon: "success ",
          });
          location.reload();
        }
      });
    });
  }

  // Event listeners para los selects de Limit y de orden
  const limitSelect = document.getElementById("limit");
  const sortSelect = document.getElementById("sort");
  const params = new URLSearchParams(window.location.search);

  if (limitSelect && params.get("limit")) {
    limitSelect.value = params.get("limit");
  }

  if (sortSelect && params.get("sort")) {
    sortSelect.value = params.get("sort");
  }
  function updateQuery() {
    const params = new URLSearchParams(window.location.search);

    if (limitSelect) {
      params.set("limit", limitSelect.value);
    }
    if (sortSelect) {
      params.set("sort", sortSelect.value);
    }

    // Recargamos la URL con los nuevos parámetros
    window.location.search = params.toString();
  }

  if (limitSelect) {
    limitSelect.addEventListener("change", updateQuery);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", updateQuery);
  }
});
