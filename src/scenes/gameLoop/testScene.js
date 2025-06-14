import SceneManager from "../../managers/sceneManager.js";

export default class TestScene extends Phaser.Scene {
    /**
    * Escena inicial en la que se cargan todos los recursos
    * @extends Phaser.Scene
    */
    constructor() {
        super({key: "TestScene"});
    }

    create() {
        this.add.image(0, 0, "mainMenu").setOrigin(0, 0);
    }
}