import BootScene from "./game/scenes/bootScene.js";
import UI from "./game/UI/UI.js";

import MainMenu from "./game/scenes/mainMenu.js";
import House from "./game/scenes/house.js";
import Hall from "./game/scenes/hall.js"
import Cafeteria from "./game/scenes/cafeteria.js";

const MAX_W = 1600, MAX_H = 900, MIN_W = 320, MIN_H = 240;
const CONFIG = {
    width: MAX_W,
    height: MAX_H,
    backgroundColor: "#000000",
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        // Carga de assets
        BootScene,

        // Test,
        MainMenu,
        House,
        Hall,
        Cafeteria,

        UI,
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
            width: MIN_W,
            height: MIN_H
        },
        max: {
            width: MAX_W,
            height: MAX_H,
        },
        zoom: 1,
        parent: "game",
    },
}

const GAME = new Phaser.Game(CONFIG);
GAME.debug = {
    enable: false,
    color: "0x00ff00"
}