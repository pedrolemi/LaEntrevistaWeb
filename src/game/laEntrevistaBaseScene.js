import BaseScene from "../framework/scenes/baseScene.js"
import GameManager from "./gameManager.js";
import { setInteractive } from "../framework/utils/misc.js"

export default class LaEntrevistaBaseScene extends BaseScene {
    constructor(name, atlasName) {
        super(name, atlasName);
    }

    create(params) {
        super.create();
        this.gameManager = GameManager.getInstance();

        this.bgScale = 1;

        this.characters = new Map();
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
    * Agrega un personaje al conjunto de personajes que hay en la escena
    * @param {Character} character - personaje que se desea agregar
    */
    addCharacter(character) {
        if (!this.characters.has(character.name)) {
            this.characters.set(character.name, character);
        }
    }

    setInteractive(gameObject, config = {}) {
        setInteractive(gameObject, config);
    }
}