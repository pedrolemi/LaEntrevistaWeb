import Blackboard from "../../framework/utils/blackboard.js";
import Singleton from "../../framework/utils/singleton.js";
import SceneManager from "../../framework/managers/sceneManager.js";
import EventDispatcher from "../../framework/managers/eventDispatcher.js";

export default class GameManager extends Singleton {
    constructor() {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Blackboard();

        this.nInteractedCharacters = 0;
        this.N_REQUIRED_INTERACTIONS = 7;
    }

    init() {
        this.sceneManager.currentScene.scene.run("UI");

        this.startGame();
    }

    startGame() {
        this.blackboard.clear();

        // this.startMainMenu();
        // this.startHouseScene();
        this.startCafeteriaScene();
    }

    startMainMenu() {
        this.sceneManager.changeScene("MainMenu", null, true);
    }

    startHouseScene() {
        this.sceneManager.changeScene("House", null, false);
    }

    startCafeteriaScene() {
        this.sceneManager.changeScene("Cafeteria", null, true);
    }

    /**
    * Incrementar el numero de personajes con los que se ha hablado
    */
    increaseInteractedCharacters() {
        ++this.nInteractedCharacters;
    }

    /**
    * Comprobar si se ha interactuado con todos los personajes necesarios 
    * @returns {Boolean} - true si alcanza el minimo requerido o false en caso contrario
    */
    hasMetInteractionRequirement() {
        return this.nInteractedCharacters >= this.N_REQUIRED_INTERACTIONS;
    }
}