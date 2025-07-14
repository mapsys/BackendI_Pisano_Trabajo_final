export async function actualizarTotalesVisuales(cartId) {
  const carritoContenedor = document.getElementById("carrito-contenido");
  const numeritoCarrito = document.getElementById("numerito");
  const carritoCantidad = document.getElementById("carrito-contenido-cantidad");
  const carritoTotal = document.getElementById("carrito-contenido-precio");
  const linkCarrito = document.getElementById("boton-carrito");

  try {
    const res = await fetch(`/api/carts/${cartId}/totales`);
    if (!res.ok) return;

    const totales = await res.json();

    if (totales.totalCantidad > 0 && carritoContenedor) {
      carritoContenedor.classList.remove("disable");
    }

    if (numeritoCarrito) numeritoCarrito.textContent = totales.totalCantidad;
    if (carritoCantidad) carritoCantidad.textContent = totales.totalCantidad;
    if (carritoTotal) carritoTotal.textContent = `$${totales.totalPrecio}`;
    if (linkCarrito) linkCarrito.href = `/carts/${cartId}`;
  } catch (err) {
    console.error("Error al actualizar visualmente los totales:", err);
  }
}
