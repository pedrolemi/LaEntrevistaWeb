import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Grid from "../../framework/UI/grid.js";

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
        let grid = new Grid(this, 340, 60, 923, 590, 2, 2, 20);

        grid.addItem(this.createFlagButton("Spain", "es"));
        grid.addItem(this.createFlagButton("United_Kingdom", "es"));
        grid.addItem(this.createFlagButton("France", "fr"));
        grid.addItem(this.createFlagButton("Portugal", "pt"));
    }

    /**
    * Crea un boton interactivo con una bandera para seleccionar el idioma
    * 
    * @param {String} frame - nombre del frame (pais) dentro del atlas
    * @param {String} language - codigo del idioma que se activara al hacer clic
    * @param {Number} scale - escala inicial del boton (opcional)
    * @returns {Phaser.GameObjects.Image} - boton interactivo de la bandera
    */
    createFlagButton(frame, language, scale = 1) {
        let animTime = 50;

        let button = this.add.image(0, 0, 'flags', frame);
        this.setInteractive(button);

        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: scale * 1.1,
                duration: animTime,
                repeat: 0,
            });
        });

        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: scale,
                duration: 0,
                repeat: 0,
            });
        });

        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scale: scale,
                duration: 0,
                repeat: 0,
            });
            this.localizationManager.changeLanguage(language);
            this.gameManager.startMainMenu();
        });
        return button;
    }
}