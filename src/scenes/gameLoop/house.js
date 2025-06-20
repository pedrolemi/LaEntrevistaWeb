import BaseScene from "./baseScene.js";
import Character from "../../character.js";

export default class House extends BaseScene {
    /**
    * Escena de la casa
    * @extends BaseScene
    */
    constructor() {
        super("House", "House");
    }

    create() {
        super.create();

        let img = this.add.image(0, 0, "blankScreen").setOrigin(0, 0);

        let nodes = this.cache.json.get("house");
        this.node = this.dialogManager.readNodes(this, nodes, "scenes\\house", "search");
        // let nodes = this.cache.json.get("test");
        // this.node = this.dialogManager.readNodes(this, nodes, "scenes\\test")

        let errors = 0;
        this.dispatcher.add("wrongAnswer", this, () => {
            errors++;
            this.blackboard.setValue("errors", errors);
        });

        let character = new Character(this, 200, 200, 0.5, "Antonio", 0.3, () => {
            console.log("Hola");
        });
        character.moveTowards({ x: 500, y: 500 })
    }

    onCreate() {
        setTimeout(() => {
            this.dialogManager.setNode(this.node);
        }, 100);
    }
}