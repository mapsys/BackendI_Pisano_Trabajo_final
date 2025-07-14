document.addEventListener("DOMContentLoaded", async () => {
  const botones = document.querySelectorAll(".producto-agregar");
  const carritoContenedor = document.getElementById("carrito-contenido");
  const numeritoCarrito = document.getElementById("numerito");
  const carritoCantidad = document.getElementById("carrito-contenido-cantidad");
  const carritoTotal = document.getElementById("carrito-contenido-precio");
  const linkCarrito = document.getElementById("boton-carrito");
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

  if (linkVolver) {
    if (esCarrito) {
      linkVolver.classList.remove("disable");
    } else {
      linkVolver.classList.add("disable");
    }
  }

  // Verifico si hay carrito al leer la pagina
  const cartId = localStorage.getItem("cartId");
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
});
