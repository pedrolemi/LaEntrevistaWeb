import Blackboard from "../../framework/utils/blackboard.js";
import Singleton from "../../framework/utils/singleton.js";
import SceneManager from "../../framework/managers/sceneManager.js";

export default class GameManager extends Singleton {
    constructor() {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Blackboard();

        this.nInteractedCharacters = 0;
    }

    /**
    * Incrementar el numero de personajes con los que se ha hablado
    */
    increaseInteractedCharacters() {
        ++this.nInteractedCharacters;
    }

    // PARA PRUEBAS
    startGame() {
        this.sceneManager.currentScene.scene.run("UI");

        // this.startCafeteriaScene();
        this.startHouseScene();
        // this.startMainMenu();
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
}