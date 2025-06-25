import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";

export default class Office extends LaEntrevistaBaseScene {
    /**
    * Escena de la oficina
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("Office");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "office").setOrigin(0, 0);

        this.nodes = this.cache.json.get("office");
        let namespace = "scenes\\office";

        let node = this.dialogManager.readNodes(this, this.nodes, namespace, "");

        let andresChar = new Character(this, 540, 710, 1, "Andres", this.characterConfig.speed, false, () => {
            this.dialogManager.setNode(node);
        });
        andresChar.setOrigin(0.5, 0.5);

        let luisaChar = new Character(this, 1125, 650, 1, "Luisa", this.characterConfig.speed, false, () => {
            this.dialogManager.setNode(node);
        });
        luisaChar.setOrigin(0.5, 0.5);

        this.add.image(0, 0, "desk").setOrigin(0, 0);

        this.blackboard.set("errors", 0);
        this.dispatcher.add("wrongAnswer", this, () => {
            let errors = this.blackboard.get("errors");
            this.blackboard.set("errors", errors + 1);

            // console.log(errors + 1);
        });


        this.dispatcher.add("exit", this, () => {
            this.gameManager.startWaitingRoomScene();
        });

        this.dispatcher.add("end", this, () => {
            this.gameManager.startMirrorScene();
        });
    }
}