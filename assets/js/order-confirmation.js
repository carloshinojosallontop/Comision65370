document.addEventListener("DOMContentLoaded", () => {
    const numeroOrden = document.getElementById("order-number");
    const botonVolverInicio = document.getElementById("back-to-store");

    // Obtener el número de orden guardado en localStorage
    const numeroGuardado = localStorage.getItem("order-number");

    if (numeroGuardado) {
        numeroOrden.textContent = `#${numeroGuardado}`; // Mostrar el número de orden guardado
    } else {
        numeroOrden.textContent = "No se encontró una orden válida."; // Mensaje si no hay número de orden
    }

    // Limpiar carrito después de finalizar orden
    localStorage.removeItem("pedido");

    // Actualizar carrito en el header
    actualizarCarritoHeader();

    // Botón para volver a la tienda
    botonVolverInicio.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
});
