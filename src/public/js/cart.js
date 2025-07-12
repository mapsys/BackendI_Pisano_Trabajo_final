document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".producto-agregar");
  const numeritoCarrito = document.getElementById("numerito");
  const carritoCantidad = document.getElementById("carrito-cantidad");
  const carritoTotal = document.getElementById("carrito-contenido-precio");
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
            console.log("Obteniendo totales del carrito con ID:", cartId);
            const res = await fetch(`/api/carts/${cartId}/totales`);
            console.log("Respuesta de totales:", res);
            const totales = await res.json();
            numeritoCarrito.textContent = totales.totalCantidad;
            carritoCantidad.textContent = totales.totalCantidad;
            carritoTotal.textContent = totales.totalPrecio;
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
