import Singleton from "../utils/singleton.js";
import SceneManager from "./sceneManager.js";


export default class GameManager extends Singleton {
    constructor(scene) {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();
    }

    // PARA PRUEBAS
    startGame() {
        this.startTitleScene();
    }
    
    startTitleScene() {
        this.sceneManager.changeScene("TestScene", null, true);
    }
}