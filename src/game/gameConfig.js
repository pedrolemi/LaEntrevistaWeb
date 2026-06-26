import BootScene from "./scenes/bootScene.js";
import PreloaderScene from "./scenes/preloaderScene.js";

import LanguageMenu from "./scenes/menus/languageMenu.js";
import MainMenu from "./scenes/menus/mainMenu.js";
import Credits from "./scenes/menus/credits.js"

import House from "./scenes/gameLoop/house.js";
import Hall from "./scenes/gameLoop/hall.js"
import Corridor from "./scenes/gameLoop/corridor.js";
import Cafeteria from "./scenes/gameLoop/cafeteria.js";
import WaitingRoom from "./scenes/gameLoop/waitingRoom.js";
import Office from "./scenes/gameLoop/office.js";
import Mirror from "./scenes/gameLoop/mirror.js";

import Question1 from "./scenes/gameLoop/questions/question1.js";
import Question2 from "./scenes/gameLoop/questions/question2.js";
import Question3 from "./scenes/gameLoop/questions/question3.js";
import Question4 from "./scenes/gameLoop/questions/question4.js";
import Question5 from "./scenes/gameLoop/questions/question5.js";
import Question6 from "./scenes/gameLoop/questions/question6.js";
import Question7 from "./scenes/gameLoop/questions/question7.js";
import Question8 from "./scenes/gameLoop/questions/question8.js";
import Question9 from "./scenes/gameLoop/questions/question9.js";

import UI from "./UI/UI.js";
import Test from "./test.js";


const MAX_W = 1600, MAX_H = 900, MIN_W = 320, MIN_H = 240;
const CONFIG = {
    width: MAX_W,
    height: MAX_H,
    backgroundColor: "#000000",
    version: "1.0",

    type: Phaser.AUTO,
    // Nota: el orden de las escenas es relevante, y las que se encuentren antes en el array se renderizaran por debajo de las siguientes
    scene: [
        Test,
        // Carga de assets
        BootScene,
        PreloaderScene,

        LanguageMenu,
        MainMenu,
        Credits,
        House,
        Hall,
        Cafeteria,
        Corridor,
        WaitingRoom,
        Office,
        Mirror,

        Question1,
        Question2,
        Question3,
        Question4,
        Question5,
        Question6,
        Question7,
        Question8,
        Question9,

        UI,
    ],
    autoFocus: true,
    // Desactivar que aparezca el menu de inspeccionar al hacer click derecho
    disableContextMenu: true,
    render: {
        antialias: true,
        roundPixels: true,
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
        expandParent: false
    },
}

gameDebug.enable = true;
gameDebug.enableText = false;
const GAME = new Phaser.Game(CONFIG);
console.log(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN)
