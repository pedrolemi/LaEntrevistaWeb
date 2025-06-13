import BootScene from "./scenes/bootScene.js";

import TestScene from "./scenes/gameLoop/testScene.js";

const max_w = 1600, max_h = 900, min_w = 320, min_h = 240;
const config = {
    width: max_w,
    height: max_h,
    backgroundColor: "#000000",
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        // Carga de assets
        BootScene,

        //TEst
        TestScene
    ],
    autoFocus: true,
    // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    disableContextMenu: true,
    render: {
        antialias: true,
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,   // CENTER_BOTH, CENTER_HORIZONTALLY, CENTER_VERTICALLY
        mode: Phaser.Scale.FIT,                 // ENVELOP, FIT, HEIGHT_CONTROLS_WIDTH, NONE, RESIZE, WIDTH_CONTROLS_HEIGHT
        min: {
            width: min_w,
            height: min_h
        },
        max: {
            width: max_w,
            height: max_h,
        },
        zoom: 1,
        parent: "game",
    },
}

const game = new Phaser.Game(config);
// Propiedad debug
game.debug = {
    enable: false,
    color: "0x00ff00"
}