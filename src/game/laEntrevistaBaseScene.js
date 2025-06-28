import BaseScene from "../framework/scenes/baseScene.js"
import DialogManager from "./managers/dialogManager.js";
import GameManager from "./managers/gameManager.js";
import TextArea from "../framework/UI/textArea.js";

export default class LaEntrevistaBaseScene extends BaseScene {
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create();

        this.gameManager = GameManager.getInstance();
        this.dialogManager = DialogManager.getInstance();
        this.characters = new Set();

        this.interactableObjects = new Set();

        this.characterConfig = {
            speed: 0.27,
        };

        this.iconConfig = {
            scale: 0.4
        };

        this.signTextConfig = {
            fontFamily: "lexend-variable",
            fontSize: 35,
            fontStyle: "normal",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5
        }
    }

    /**
    * Se encarga de configurar la escena con los parametros iniciales y
    * @param {Object} params - parametros que se le pasan a la configuracion inicial 
    */
    initialSetup(params) {
        super.initialSetup(params)
        this.dialogManager.setCharacters(this.characters);
    }

    /**
    * Maneja la salida de los personajes de la sala.
    * Desactiva la interracion con los objetos mientras los personajes se mueven hacia la salida,
    * y la vuelve a activar una vez que todos hayan salido
    * @param {Array} characters - array con los personajes que deben salir
    * @param {Object} exitPoint - punto destino con propiedades {x, y}
    * @param {Number} depth - profundidad que se asigna los personajes al salir
    */
    leaveRoom(characters, exitPoint, depth = 1) {
        let nCharactersExited = 0;
        let nCharacters = characters.length;
        // Desactiva la interaccion con todos los objetos mientras los personajes abandonan la sala
        this.interactableObjects.forEach(obj => {
            obj.disableInteractive();
        });

        characters.forEach((character) => {
            // El personaje se mueve hacia el punto de salida
            character.setDepth(depth);
            character.moveTowards(exitPoint);

            character.once("targetReached", () => {
                // Se incrementa el contador global de personajes con los que se ha interactuado
                this.gameManager.increaseInteractedCharacters();

                // Se elimina el personaje
                this.interactableObjects.delete(character);
                character.removeEvents();
                character.destroy();

                ++nCharactersExited;

                // Cuando todos los personajes han salido, se vuelve a activar la interaccion con los objetos
                if (nCharactersExited >= nCharacters) {
                    this.interactableObjects.forEach((obj) => {
                        this.setInteractive(obj);
                    });
                }
            });
        });
    };


    /**
    * Configura un objeto para que sea interactivo y lo agrega al conjunto de objetos interactuables
    * @param {Phaser.GameObject} gameObject - objeto que se va a hacer interactivo 
    * @param {Object} prevConfig - configuracion a la que agregar el parametro del cursor 
    */
    setInteractive(gameObject, config = {}) {
        super.setInteractive(gameObject, config);

        if (!this.interactableObjects.has(gameObject)) {
            this.interactableObjects.add(gameObject);
        }
    }

    /**
    * Crea una TexArea con opcion de mostrar un rectangulo de depuracion
    * @param {Number} x - posicion x
    * @param {Number} y - posicion y
    * @param {Number} width - ancho del area
    * @param {Number} height - alto del area
    * @param {Number} originX - punto de origen x
    * @param {Number} originY - punto de origen y
    * @param {String} text - texto que se muestra
    * @param {Object} textConfig - estilo del texto
    * @returns {TextArea} - TextArea creada
    */
    createTextArea(x, y, width, height, originX, originY, text, textConfig) {
        let debug = this.sys.game.debug;
        if (debug.enable) {
            let debugRect = this.add.rectangle(x, y, width, height, 0x000000, 0);
            debugRect.setStrokeStyle(2, debug.color);
            debugRect.setOrigin(originX, originY);
        }
        let textArea = new TextArea(this, x, y, width, height, text, textConfig);
        textArea.setOrigin(originX, originY);
        textArea.adjustFontSize();
        return textArea;
    }
}