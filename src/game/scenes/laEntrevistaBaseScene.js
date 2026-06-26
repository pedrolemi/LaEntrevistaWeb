import BaseScene from "../../framework/scenes/baseScene.js"
import GameManager from "../managers/gameManager.js";
import TrackerManager from "../managers/trackerManager.js";

export default class LaEntrevistaBaseScene extends BaseScene {
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create();

        this.gameManager = GameManager.getInstance();
        this.trackerManager = TrackerManager.getInstance();

        this.interactableObjects = new Set();

        this.characterConfig = {
            speed: 0.27,
        };

        this.SIGN_TEXT_CONFIG = {
            fontFamily: "lexend-variable",
            fontSize: 35,
            fontStyle: "normal",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5,
            align: "center"
        }
    }


    /**
    * Maneja la salida de los personajes de la sala.
    * Desactiva la interracion con los objetos mientras los personajes se mueven hacia la salida,
    * y la vuelve a activar una vez que todos hayan salido
    * @param {Array} characters - array con los personajes que deben salir
    * @param {Phaser.Math.Vector2} exitPoint - punto destino
    * @param {number} scaleFactor - factor para disminuir o aumentar la escala de los personajes el movimiento (opcional)
    * @param {number} depth - profundidad que se asigna los personajes al salir (opcional)
    */
    leaveRoom(characters, exitPoint, scaleFactor = 1, depth = 1) {
        let nCharactersExited = 0;
        let nCharacters = characters.length;

        // Desactiva la interaccion con todos los objetos mientras los personajes abandonan la sala
        this.disableAllInteraction();

        characters.forEach((character) => {
            // El personaje se mueve hacia el punto de salida
            character.setDepth(depth);
            character.moveTowards(exitPoint, scaleFactor);

            character.once("targetReached", () => {
                // Se incrementa el contador global de personajes con los que se ha interactuado
                this.gameManager.increaseCharactersInteracted();

                // Se elimina el personaje
                this.interactableObjects.delete(character);
                character.removeEvents();
                character.destroy();

                ++nCharactersExited;

                // Cuando todos los personajes han salido, se vuelve a activar la interaccion con los objetos
                if (nCharactersExited >= nCharacters) {
                    this.enableAllInteraction();
                }
            });
        });
    };

    /**
    * Desactiva la interaccion con todos los objetos interactuables de la escena
    */
    disableAllInteraction() {
        this.interactableObjects.forEach(obj => {
            obj.disableInteractive();
        });
    }

    /**
    * Activa la interaccion con todos los objetos interactuables de la escena
    */
    enableAllInteraction() {
        this.interactableObjects.forEach(obj => {
            obj.setInteractive();
        });
    }


    /**
    * Configura un objeto para que sea interactivo y lo agrega al conjunto de objetos interactuables
    * @param {Phaser.GameObjects.GameObject} gameObject - objeto que se va a hacer interactivo 
    * @param {object} prevConfig - configuracion a la que agregar el parametro del cursor 
    */
    setInteractive(gameObject, config = {}) {
        super.setInteractive(gameObject, config);

        if (!this.interactableObjects.has(gameObject)) {
            this.interactableObjects.add(gameObject);
        }
    }
}