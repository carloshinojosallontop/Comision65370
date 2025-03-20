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
    async function renderProducts() {
      const productosLista = document.querySelector(".products-list");
      if (!productosLista) return;
  
      // Mostrar un spinner o mensaje de carga
      const spinner = document.createElement("div");
      spinner.textContent = "Cargando productos...";
      spinner.classList.add("spinner");
      productosLista.appendChild(spinner);
  
      // Simular retardo de 2 segundos usando setTimeout
      setTimeout(async () => {
        // Obtener productos de forma asíncrona
        const productos = await obtenerProductos();
  
        // Remover el spinner de carga
        productosLista.removeChild(spinner);
  
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
        botonPedido.addEventListener("click", () => handlePedido(productos));
      }, 2000);
    }
  
    // Función que procesa el pedido y lo guarda en localStorage
    function handlePedido(productos) {
      const inputs = document.querySelectorAll(".quantity");
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
              total: cantidad * producto.precio
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
  
    document.addEventListener("DOMContentLoaded", renderProducts);
  })();
  