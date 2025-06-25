import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";

export default class Hall extends LaEntrevistaBaseScene {
    /**
    * Escena de la casa
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("Hall");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "hall").setOrigin(0, 0);

        this.nodes = this.cache.json.get("hall");
        let namespace = "scenes\\hall";

        let node = this.dialogManager.readNodes(this, this.nodes, namespace, "start");

        let receptionist = new Character(this, 0, 0, 0.33, "Ivan", this.characterConfig.speed, false, () => {
            this.dialogManager.setNode(node);
        });
        receptionist.setOrigin(0.5, 0.5);
        receptionist.setPosition(775, 525);
        receptionist.playDefaultAnimation();

        this.add.image(0, 0, "counter").setOrigin(0, 0);


        this.dispatcher.add("point", this, () => {
            // TODO: ANIMACION DE SENALAR
        });

        this.dispatcher.add("end", this, () => {
            node = this.dialogManager.readNodes(this, this.nodes, namespace, "repeat");

            let stairs = this.add.rectangle(1350, 453, 500, 660, 0x000, 0);
            this.setInteractive(stairs);
            stairs.on("pointerdown", () => {
                stairs.disableInteractive();
                // this.gameManager.startCorridorScene();

                this.gameManager.startGame();
            })

        });
    }
}