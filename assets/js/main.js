(function() {
  // Función asíncrona para obtener los productos desde la API remota
  async function obtenerProductos() {
    try {
      const respuesta = await fetch("https://my-json-server.typicode.com/carloshinojosallontop/api-fake/products");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los productos: " + respuesta.status);
      }
      const productos = await respuesta.json();
      return productos;
    } catch (error) {
      console.error("Error en fetch:", error);
      return [];
    }
  }

  // Función que renderiza los productos en la página
  async function renderizarProductos() {
    const productosLista = document.querySelector(".products-list");
    if (!productosLista) return;

    // Mostrar SweetAlert de carga con un spinner animado
    Swal.fire({
      title: "Cargando productos...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        loader: 'my-loader-class'
      }
    });

    // Simular retardo de 1 segundo (para emular condiciones de red)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Obtener productos de forma asíncrona
    const productos = await obtenerProductos();

    // Cerrar el alert de carga
    Swal.close();

    // Crear contenedor con encabezados de la grilla
    const cuadro = document.createElement("div");
    cuadro.classList.add("products-grid");
    cuadro.innerHTML = ` 
      <div class="products-grid-header">Código</div>
      <div class="products-grid-header">Descripción</div>
      <div class="products-grid-header">Precio</div>
      <div class="products-grid-header">Stock</div>
      <div class="products-grid-header">Orden</div>
    `;

    // Agregar cada producto a la grilla
    productos.forEach(producto => {
      cuadro.innerHTML += `
        <div class="item item-align-left">${producto.id}</div>
        <div class="item item-align-left">${producto.nombre}</div>
        <div class="item">$${producto.precio}</div>
        <div class="item">${producto.stock}</div>
        <input type="number" class="quantity" data-id="${producto.id}" min="0" max="${producto.stock}" value="0">
      `;
    });
    productosLista.appendChild(cuadro);

    // Crear y agregar el botón "Realizar Pedido"
    const divBoton = document.createElement("div");
    divBoton.classList.add("place-order");
    const botonPedido = document.createElement("button");
    botonPedido.classList.add("btn");
    botonPedido.textContent = "Realizar Pedido";
    divBoton.appendChild(botonPedido);
    productosLista.appendChild(divBoton);

    // Asociar evento al botón
    botonPedido.addEventListener("click", () => procesarPedido(productos));
  }

  // Función que procesa el pedido y lo guarda en localStorage
  function procesarPedido(productos) {
    const inputs = document.querySelectorAll(".quantity");
    let productosExcedidos = [];

    // Validar si se ingresaron cantidades superiores al stock para cada input
    for (let input of inputs) {
      const cantidad = parseInt(input.value) || 0;
      const maxStock = parseInt(input.getAttribute("max"));
      if (cantidad > maxStock) {
        const producto = productos.find(item => item.id === Number(input.dataset.id));
        if (producto) {
          productosExcedidos.push(producto.nombre);
        }
      }
    }

    // Si hay productos con cantidad superior al stock, se muestra la alerta y se cancela el pedido
    if (productosExcedidos.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error de stock',
        text: 'No hay las cantidades solicitadas en: ' + productosExcedidos.join(", ")
      });
      return;
    }

    let nuevosProductos = [];
    inputs.forEach(input => {
      const cantidad = parseInt(input.value);
      if (cantidad > 0) {
        const producto = productos.find(item => item.id === Number(input.dataset.id));
        if (producto) {
          nuevosProductos.push({
            id: producto.id,
            nombre: producto.nombre,
            cantidad,
            precio: producto.precio,
            total: cantidad * producto.precio,
            stock: producto.stock 
          });
        }
      }
    });

    if (nuevosProductos.length > 0) {
      let carritoActual = JSON.parse(localStorage.getItem("pedido")) || [];
      nuevosProductos.forEach(nuevo => {
        let productoExistente = carritoActual.find(item => item.id === nuevo.id);
        if (productoExistente) {
          productoExistente.cantidad += nuevo.cantidad;
          productoExistente.total = productoExistente.cantidad * productoExistente.precio;
        } else {
          carritoActual.push(nuevo);
        }
      });
      localStorage.setItem("pedido", JSON.stringify(carritoActual));
      if (typeof actualizarCarritoHeader === "function") {
        actualizarCarritoHeader();
      }
      window.location.href = "cart.html";
    } else {
      let mensajeError = document.querySelector(".error-message");
      if (!mensajeError) {
        mensajeError = document.createElement("div");
        mensajeError.classList.add("error-message");
        mensajeError.textContent = "* No has seleccionado productos";
        document.querySelector(".products-list").appendChild(mensajeError);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", renderizarProductos);
})();

  