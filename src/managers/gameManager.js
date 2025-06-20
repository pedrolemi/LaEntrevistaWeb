import Blackboard from "../utils/blackboard.js";
import Singleton from "../utils/singleton.js";
import SceneManager from "./sceneManager.js";

export default class GameManager extends Singleton {
    constructor() {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Blackboard();
    }

    // PARA PRUEBAS
    startGame() {
        this.sceneManager.currentScene.scene.run("UI");

        this.startHouseScene();
        // this.startMainMenu();
    }

    startMainMenu() {
        this.sceneManager.changeScene("MainMenu", null, true);
    }

    startHouseScene() {
        this.sceneManager.changeScene("House", null, false);
    }
}