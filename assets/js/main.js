const productos = [
    { id: 8345, nombre: "Assassins Creed Mirage PS5", precio: 35, stock: 16 },
    { id: 4441, nombre: "Mortal Kombat 1 PS5", precio: 44, stock: 5 },
    { id: 5455, nombre: "Dragon Ball Fighter Z PS5", precio: 25, stock: 78 },
    { id: 1717, nombre: "EA Sports FC 25 PS5", precio: 45, stock: 4 },
    { id: 4350, nombre: "Gran Turismo 7 PS5", precio: 15, stock: 12 },
    { id: 2715, nombre: "Super Mario Odyssey NSW", precio: 40, stock: 45 },
    { id: 7524, nombre: "Mario Kart 8 Deluxe NSW", precio: 42, stock: 3 },
    { id: 2509, nombre: "NBA 2K25 NSW", precio: 38, stock: 8 },
    { id: 6265, nombre: "Luigi's Mansion 3 NSW", precio: 42, stock: 10 },
    { id: 5661, nombre: "Just Dance 2024 NSW", precio: 49, stock: 10 },
    { id: 6543, nombre: "God of War Ragnarok PS4", precio: 45, stock: 24 },
    { id: 3344, nombre: "Grand Theft Auto V Premium Edition PS4", precio: 19, stock: 31 }
];


// Crear y agregar tabla de productos
const productosLista = document.querySelector(".productos-lista");

const cuadro = document.createElement("div");
cuadro.classList.add("productos-cuadro");

cuadro.innerHTML = `
  <div class="productos-cuadro-header">Código</div>
  <div class="productos-cuadro-header">Descripción</div>
  <div class="productos-cuadro-header">Precio</div>
  <div class="productos-cuadro-header">Stock</div>
  <div class="productos-cuadro-header">Orden</div>
`;

productos.forEach(producto => {
    cuadro.innerHTML += `
    <div class="item item-align-left">${producto.id}</div>
    <div class="item item-align-left">${producto.nombre}</div>
    <div class="item">$${producto.precio}</div>
    <div class="item">${producto.stock}</div>
    <input type="number" class="cantidad" data-id="${producto.id}" min="0" max="${producto.stock}" value="0">
  `;
});

productosLista.appendChild(cuadro);


// Crear y agregar boton "Realizar Pedido" al final de productosLista
const divBoton = document.createElement("div");
divBoton.classList.add("realizar-pedido");

const botonPedido = document.createElement("button");
botonPedido.classList.add("btn");
botonPedido.textContent = "Realizar Pedido";

divBoton.appendChild(botonPedido);

productosLista.appendChild(divBoton);


// Agregar funcionalidad al botón "Realizar Pedido"
botonPedido.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".cantidad");
    let nuevosProductos = [];

    inputs.forEach(input => {
        const cantidad = parseInt(input.value);
        if (cantidad > 0) {
            const producto = productos.find(item => item.id === Number(input.dataset.id));
            nuevosProductos.push({
                id: producto.id,
                nombre: producto.nombre,
                cantidad,
                precio: producto.precio,
                total: cantidad * producto.precio
            });
        }
    });

    if (nuevosProductos.length > 0) {
        // Recuperar carrito actual del localStorage
        let carritoActual = JSON.parse(localStorage.getItem("pedido")) || [];

        // Combinar productos nuevos con los que ya estaban en el carrito
        nuevosProductos.forEach(nuevo => {
            let productoExistente = carritoActual.find(item => item.id === nuevo.id);
            if (productoExistente) {
                productoExistente.cantidad += nuevo.cantidad;
                productoExistente.total = productoExistente.cantidad * productoExistente.precio;
            } else {
                carritoActual.push(nuevo);
            }
        });

        // Guardar la nueva lista en localStorage
        localStorage.setItem("pedido", JSON.stringify(carritoActual));

        // Actualizar carrito en el header
        actualizarCarritoHeader();

        // Redirigir a cart.html
        window.location.href = "cart.html";
    } else {
        let mensajeError = document.querySelector(".mensaje-error");

        if (!mensajeError) {
            mensajeError = document.createElement("div");
            mensajeError.classList.add("mensaje-error");
            mensajeError.textContent = "* No has seleccionado productos";

            productosLista.appendChild(mensajeError);
        }
    }
});
