# GamingStore - Carrito de Compras

Proyecto de e-commerce simulado para venta de videojuegos. Permite explorar productos, agregar al carrito, realizar pedidos y gestionar el stock.

## Descripción

GamingStore es una tienda online que simula el proceso de compra de productos al por mayor. Los usuarios pueden:

- Visualizar una lista de productos disponibles.
- Agregar productos al carrito.
- Editar cantidades respetando el stock.
- Realizar el pedido y simular una compra finalizada.
- Gestionar sesión (login/logout).

La aplicación valida el stock al realizar pedidos y actualizar cantidades en el carrito, mostrando alertas con SweetAlert2.

## Estructura de Carpetas

root/
│
├── index.html
├── pages/
│   ├── cart.html
│   ├── order-confirmation.html
│   └── products.html
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── cart.js
│   │   ├── cart-header.js
│   │   ├── login.js
│   │   ├── main.js
│   │   └── order-confirmation.js
│   └── images/
│       
└── README.md

## Tecnologías Utilizadas

- HTML5 & CSS3
- JavaScript Vanilla (ES6)
- SweetAlert2
- FontAwesome
- LocalStorage 

## Funcionalidades Principales

### 1. Login de Usuario

- Usuario: `admin`
- Contraseña: `1234`
- Guarda el estado de sesión en localStorage (`loggedIn`).

### 2. Productos

- Se cargan desde un API JSON fake.
- Visualización de: Código, Descripción, Precio, Stock y opción de cantidad.
- El usuario puede agregar productos al carrito con control de stock.
- Validación antes de realizar un pedido con alertas si el stock es insuficiente.

### 3. Carrito de Compras

- Visualización completa del pedido:
  - Código, Descripción, Precio, Cantidad y Total por producto.
- Posibilidad de editar cantidades, respetando el stock:
  - Si supera el stock, se alerta con un SweetAlert2 detallado.
- Botones para Actualizar carrito, Seguir comprando o Finalizar orden.
- Resumen de compra con Subtotal, Impuestos y Total.

### 4. Logout

- Al cerrar sesión:
  - SweetAlert de confirmación.
  - Redirección automática a `index.html`.
  - Funciona correctamente desde cualquier página.

## Cómo Funciona

### Login

- Si el usuario no está logueado, aparece automáticamente un popup para iniciar sesión.
- Al cerrar sesión, se borra el estado de `loggedIn` y se redirige a `index.html`.

### Productos

- Se cargan desde la URL:  
  `https://my-json-server.typicode.com/carloshinojosallontop/api-fake/products`
- Cada producto incluye `stock` para validar cantidades.

### Carrito

- Los datos del carrito se almacenan en localStorage con la clave `"pedido"`.
- Se valida:
  - Que la cantidad no supere el stock al realizar un pedido o actualizar el carrito.
  - Que el carrito no esté vacío antes de finalizar el pedido.