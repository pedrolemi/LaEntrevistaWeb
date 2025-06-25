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

        this.ui = null;

        this.nInteractedCharacters = 0;
        this.N_REQUIRED_INTERACTIONS = 7;
    }

    init() {
        this.sceneManager.currentScene.scene.run("UI");
        this.startGame();
    }

    startGame() {
        this.blackboard.clear();

        if (this.ui == null) {
            this.ui = this.sceneManager.currentScene.scene.get("UI");
        }
        else {
            this.dispatcher.shutdown();
            this.ui.shutdown();
            this.ui.scene.restart();
        }

        // this.blackboard.set("position", "dataScience");

        // this.startMainMenu();
        // this.startHouseScene();
        this.startHallScene();
        // this.startCorridorScene();
        // this.startCafeteriaScene();
        // this.startOfficeScene();
    }

    startMainMenu() {
        this.sceneManager.changeScene("MainMenu", null, true);
    }

    startHouseScene() {
        this.sceneManager.changeScene("House", null, false);
    }

    startHallScene() {
        this.sceneManager.changeScene("Hall", {
            fadeOutTime: 500,
            fadeInTime: 500,
        }, true, false);
    }

    startCorridorScene() {
        this.sceneManager.changeScene("Corridor", null, true, true);
    }

    startCafeteriaScene() {
        this.sceneManager.changeScene("Cafeteria", null, true, true);
    }

    startWaitingRoomScene() {
        // TEST
        // this.sceneManager.changeScene("Corridor", null, true, true);
        this.sceneManager.changeScene("Office", null, true, true);
    }

    startOfficeScene() {
        this.sceneManager.changeScene("Office", null, true, true);
    }

    startMirrorScene() {
        // TEST
        this.sceneManager.changeScene("Cafeteria", null, true, true);
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