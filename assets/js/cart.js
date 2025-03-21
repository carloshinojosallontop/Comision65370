document.addEventListener("DOMContentLoaded", () => {
    const carritoLista = document.querySelector(".cart-list");
    const subtotalElement = document.getElementById("subtotal");
    const impuestoElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const botonActualizar = document.getElementById("update-cart");
    const botonFinalizar = document.getElementById("checkout");
    const botonSeguirComprando = document.getElementById("continue-shopping");

    // Obtener los productos del pedido desde localStorage
    let pedido = JSON.parse(localStorage.getItem("pedido")) || [];

    if (pedido.length === 0) {
        carritoLista.innerHTML = "<p>No hay productos en el carrito.</p>";
        subtotalElement.textContent = "Subtotal: $0";
        impuestoElement.textContent = "Impuesto (7%): $0";
        totalElement.textContent = "Total a Pagar: $0";
        return;
    }

    // Función para renderizar la lista de productos y actualizar totales
    function renderizarCarrito() {
        carritoLista.innerHTML = "";
        let subtotal = 0;

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="products-grid-header">Borrar</div>
            <div class="products-grid-header">Código</div>
            <div class="products-grid-header">Descripción</div>
            <div class="products-grid-header">Precio</div>
            <div class="products-grid-header">Orden</div>
            <div class="products-grid-header">Total</div>
        `;

        pedido.forEach((producto, index) => {
            div.innerHTML += `
                <div class="item"><button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button></div>
                <div class="item item-align-left">${producto.id}</div>
                <div class="item item-align-left"><strong>${producto.nombre}</strong></div>
                <div class="item">$${producto.precio}</div>
                <input type="number" class="quantity-input" data-index="${index}" min="1" value="${producto.cantidad}">
                <div class="item">$<span class="total-item">${producto.total}</span></div>
            `;
            subtotal += producto.total;
        });

        carritoLista.appendChild(div);

        const impuesto = subtotal * 0.07;
        const total = subtotal + impuesto;

        subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
        impuestoElement.textContent = `Impuesto (7%): $${impuesto.toFixed(2)}`;
        totalElement.textContent = `Total a Pagar: $${total.toFixed(2)}`;

        localStorage.setItem("pedido", JSON.stringify(pedido)); // Guardar cambios

        // Agregar eventos a los inputs de cantidad
        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("input", () => { // Detecta cambios en tiempo real
                mostrarBotonActualizar();
            });
        });

        // Agregar eventos a los botones de eliminar
        document.querySelectorAll(".delete-btn").forEach(boton => {
            boton.addEventListener("click", eliminarProducto);
        });

        // Ocultar el botón de actualizar al cargar
        botonActualizar.style.display = "none";

        // Actualizar visibilidad de botones y menú
        actualizarVisibilidadBotones();
        actualizarVisibilidadDesglose();
        actualizarVisibilidadBotonMenu();
        actualizarCarritoHeader();
    }

    function actualizarVisibilidadDesglose() {
        const desglosePago = document.querySelector(".payment-breakdown");
        if (pedido.length === 0) {
            desglosePago.style.visibility = "hidden";
            desglosePago.style.opacity = "0";
        } else {
            desglosePago.style.visibility = "visible";
            desglosePago.style.opacity = "1";
        }
    }

    function actualizarVisibilidadBotones() {
        const botonFinalizar = document.getElementById("checkout");
        const botonSeguirComprando = document.getElementById("continue-shopping");
        if (pedido.length === 0) {
            botonFinalizar.style.display = "none";
            botonSeguirComprando.style.display = "none";
        } else {
            botonFinalizar.style.display = "block";
            botonSeguirComprando.style.display = "block";
        }
    }

    function actualizarVisibilidadBotonMenu() {
        const botonRegresar = document.getElementById("return-home");
        const carritoVacio = pedido.length === 0;
        if (botonRegresar) {
            botonRegresar.style.display = carritoVacio ? "block" : "none";
        }
    }

    // Función para actualizar la cantidad de productos
    function actualizarCarrito() {
        let productosExcedidos = [];

        // Primer recorrido para validar que ninguna cantidad exceda el stock disponible
        document.querySelectorAll(".quantity-input").forEach(input => {
            const index = input.dataset.index;
            let nuevaCantidad = parseInt(input.value);
            // Convertir el stock a número para asegurar la comparación
            const stockDisponible = parseInt(pedido[index].stock);

            if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                input.value = 1;
            } else if (nuevaCantidad > stockDisponible) {
                productosExcedidos.push(pedido[index].nombre);
            }
        });

        // Si existen productos con cantidad superior al stock, se muestra alerta y se cancela la actualización
        if (productosExcedidos.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error de stock',
                text: 'No hay las cantidades solicitadas en: ' + productosExcedidos.join(', ')
            });
            return;
        }

        // Segundo recorrido para actualizar el pedido si no hay errores
        document.querySelectorAll(".quantity-input").forEach(input => {
            const index = input.dataset.index;
            let nuevaCantidad = parseInt(input.value);
            if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                nuevaCantidad = 1;
                input.value = 1;
            }
            pedido[index].cantidad = nuevaCantidad;
            pedido[index].total = pedido[index].precio * nuevaCantidad;
        });

        renderizarCarrito(); // Actualiza la vista
    }

    function mostrarBotonActualizar() {
        const botonActualizar = document.getElementById("update-cart");
        if (botonActualizar) {
            botonActualizar.style.display = "block";
        }
    }

    // Función para eliminar un producto del carrito
    function eliminarProducto(event) {
        const index = event.target.dataset.index;
        pedido.splice(index, 1);
        if (pedido.length === 0) {
            localStorage.removeItem("pedido");
            carritoLista.innerHTML = "<p>No hay productos en el carrito.</p>";
            subtotalElement.textContent = "Subtotal: $0";
            impuestoElement.textContent = "Impuesto (7%): $0";
            totalElement.textContent = "Total a Pagar: $0";
        } else {
            renderizarCarrito();
        }
        actualizarVisibilidadBotones();
        actualizarVisibilidadDesglose();
        actualizarVisibilidadBotonMenu();
        actualizarCarritoHeader();
    }

    // Evento para actualizar el carrito
    botonActualizar.addEventListener("click", () => {
        actualizarCarrito();
    });

    // Evento para finalizar la orden usando SweetAlert
    botonFinalizar.addEventListener("click", async () => {
        Swal.fire({
            title: "Finalizando orden...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Simular retardo de 2 segundos para procesar la orden
        await new Promise(resolve => setTimeout(resolve, 2000));

        const numeroOrden = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem("order-number", numeroOrden);
        localStorage.removeItem("pedido");

        Swal.close();
        window.location.href = "order-confirmation.html";
    });

    // Evento para seguir comprando
    botonSeguirComprando.addEventListener("click", () => {
        window.location.href = "products.html";
    });

    // Evento para regresar al menú principal cuando el carrito está vacío
    const botonRegresar = document.getElementById("return-home");
    if (botonRegresar) {
        botonRegresar.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }

    // Renderizar el carrito al cargar la página
    renderizarCarrito();
});

