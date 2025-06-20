import BaseScene from "./baseScene.js";


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

        let character = this.add.sprite(200, 200, "Alex", "Alex_idle_0001").setScale(0.5)
        character.play("AlexIdle")
    }

    onCreate() {
        setTimeout(() => {
            this.dialogManager.setNode(this.node);
        }, 100);
    }
}