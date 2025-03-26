const abrirMenu = document.querySelector('#open')
const cerrarMenu = document.querySelector('#close')
const menu = document.querySelector('#menu-main')

abrirMenu.addEventListener("click", ()=> {
  menu.classList.add('visibility')
})

cerrarMenu.addEventListener("click", ()=> {
  menu.classList.remove('visibility')
})