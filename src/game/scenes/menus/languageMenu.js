import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Grid from "../../../framework/UI/grid.js";
import { growAnimation } from "../../../framework/utils/graphics.js";

export default class LanguageMenu extends LaEntrevistaBaseScene {
    /**
    * Escena que muestra el menu de selección de idioma
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("LanguageMenu",);
    }

    create() {
        super.create();

        let img = this.add.image(0, 0, "blankScreen").setOrigin(0, 0);

        // Se crea una cuadricula para organizar los botones de idioma
        let grid = new Grid(this, 340, 60, 923, 590, 2, 1, 20);

        grid.addItem(this.createFlagButton("es", "es"));
        grid.addItem(this.createFlagButton("fr", "fr"));
        // grid.addItem(this.createFlagButton("United_Kingdom", "es"));
        // grid.addItem(this.createFlagButton("Portugal", "pt"));
    }

    /**
    * Crea un boton interactivo con una bandera para seleccionar el idioma
    * 
    * @param {string} frame - nombre del frame (pais) dentro del atlas
    * @param {string} language - codigo del idioma que se activara al hacer clic
    * @param {number} scale - escala inicial del boton (opcional)
    * @returns {Phaser.GameObjects.Image} - boton interactivo de la bandera
    */
    createFlagButton(frame, language, scale = 1) {
        let animTime = 50;

        let button = this.add.image(0, 0, "flags", frame).setScale(scale);
        growAnimation(button, button, () => {
            // TRACKER EVENT
            this.trackerManager.sendSelectLanguage(language);

            this.localizationManager.changeLanguage(language);
            this.gameManager.startMainMenu();
        }, true, false, 1.1, true, animTime);
        
        return button;
    }
}