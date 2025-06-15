import GameManager from "../../managers/gameManager.js";
import DialogManager from "../../managers/dialogManager.js";
import Blackboard from "../../utils/blackboard.js";
import EventDispatcher from "../../eventDispatcher.js";

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

        this.blackboard = new Blackboard();
        this.gameManager = GameManager.getInstance();
        this.dialogManager = DialogManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        // let nodes = this.cache.json.get("house");
        // let lol = this.dialogManager.readNodes(nodes, "house", "search")
        let nodes = this.cache.json.get("test");
        let lol = this.dialogManager.readNodes(this, nodes, "test")

    }
}