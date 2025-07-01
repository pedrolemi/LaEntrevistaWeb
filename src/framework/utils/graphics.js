// Configuracion de texto por defecto
export let DEFAULT_TEXT_CONFIG = {
    fontFamily: "Arial",        // Fuente (tiene que estar precargada en el html o el css)
    fontSize: 25,               // Tamano de la fuente del dialogo
    fontStyle: "normal",        // Estilo de la fuente
    backgroundColor: null,      // Color del fondo del texto
    color: "#ffffff",           // Color del texto
    stroke: "#000000",          // Color del borde del texto
    strokeThickness: 5,         // Grosor del borde del texto 
    align: "left",              // Alineacion del texto ("left", "center", "right", "justify")
    wordWrap: null,
    padding: null               // Separacion con el fondo (en el caso de que haya fondo)
}

export function componentToHex(component) {
    // Se convierte en un numero de base 16, en string
    let hex = component.toString(16);
    // Si el numero es menor que 16, solo tiene un digito, por lo que hay que anadir un 0 delante
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(R, G, B) {
    return "#" + componentToHex(R) + componentToHex(G) + componentToHex(B);
}

export function hexToRgb(hex) {
    // ^ ---> tiene que comenzar por #
    // a-f\d --> caracteres entre a-f y entre 0-9 (\d)
    // {2} --> grupo de dos caracteres que cumplan la condicion de arriba
    // $ --> final de la cadena. De modo que por ejemplo, "Some text #ffffff some more" no valdria
    // i --> se permiten letras en minuscula y en mayuscula
    let regex = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    let result = regex.exec(hex);

    if (result) {
        return {
            R: parseInt(result[1], 16),
            G: parseInt(result[2], 16),
            B: parseInt(result[3], 16)
        }
    }
    return null;
}

export function hexToColor(hex) {
    return Phaser.Display.Color.IntegerToColor(hex);
}