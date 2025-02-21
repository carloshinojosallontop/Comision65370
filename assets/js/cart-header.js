function actualizarCarritoHeader() {
    const carritoContador = document.getElementById("carrito-contador");
    const carritoTotal = document.getElementById("carrito-total");

    let pedido = JSON.parse(localStorage.getItem("pedido")) || [];

    if (pedido.length === 0) {
        carritoContador.textContent = "0";
        carritoTotal.textContent = "0.00";
        return;
    }

    let totalItems = pedido.reduce((acc, item) => acc + item.cantidad, 0);
    let totalPrecio = pedido.reduce((acc, item) => acc + item.total, 0);

    carritoContador.textContent = totalItems;
    carritoTotal.textContent = totalPrecio.toFixed(2);
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", actualizarCarritoHeader);
