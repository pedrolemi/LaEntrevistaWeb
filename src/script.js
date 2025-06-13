// Pone el focus en el canvas del juego al cargar la pagina
window.onload = function () {
    let focused = document.querySelector("#game");
    focused.focus();
};

// Comprobar si el input es tactil o con teclado y raton
var IS_TOUCH = false;
window.addEventListener('touchstart', function () {
    IS_TOUCH = true;
});
window.addEventListener('mousedown', function () {
    IS_TOUCH = false;
});