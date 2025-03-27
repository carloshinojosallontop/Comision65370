document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");

  // Mostrar el botón si el usuario ya está logeado
  if (localStorage.getItem("loggedIn") === "true") {
    logoutButton.style.display = "inline-flex";
  } else {
    mostrarPopupLogin();
  }

  // Función para mostrar el popup de login
  function mostrarPopupLogin() {
    Swal.fire({
      title: 'Iniciar sesión',
      html: `
      <label for="swal-username">Usuario:&nbsp;&nbsp;&nbsp;</label>
      <input type="text" id="swal-username" class="swal2-input">
      <label for="swal-password">Password:</label>
      <input type="password" id="swal-password" class="swal2-input">
    `,
      confirmButtonText: 'Ingresar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#swal-username').value.trim();
        const password = Swal.getPopup().querySelector('#swal-password').value.trim();

        if (!username || !password) {
          Swal.showValidationMessage(`Por favor completa todos los campos`);
          return false;
        }

        if (username === 'admin' && password === '1234') {
          // Retornamos un objeto que indique éxito.
          return { loginOk: true };
        } else {
          Swal.showValidationMessage(`Usuario o contraseña incorrectos`);
          return false;
        }
      }
    }).then((result) => {
      if (result.value && result.value.loginOk) {
        // Si la validación fue exitosa, guardamos el estado y mostramos el modal de éxito.
        localStorage.setItem("loggedIn", "true");
        logoutButton.style.display = "inline-flex";

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Inicio de sesión exitoso',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        // Si el login no fue exitoso, volvemos a mostrar el popup.
        mostrarPopupLogin();
      }
    });
  }

  // Evento del botón logout
  logoutButton.addEventListener("click", () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("loggedIn");
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Debes iniciar sesión nuevamente',
          showConfirmButton: false,
          timer: 1500
        });

        // Ocultar el botón de logout
        logoutButton.style.display = "none";

        // Volver a mostrar el popup de login después de cerrar sesión
        setTimeout(() => {
          let path = window.location.pathname;

          // Si ya estás en el index.html o raíz, redirige simple
          if (path.endsWith("index.html") || path === "/" || path === "") {
            window.location.href = "./index.html";
          } else {
            // Si estás en pages o subcarpetas, sube un nivel
            window.location.href = "../index.html";
          }
          mostrarPopupLogin();
        }, 1500);
      }
    });
  });
});