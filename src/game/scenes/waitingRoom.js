import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";

export default class waitingRoom extends LaEntrevistaBaseScene {
    /**
    * Escena del pasillo
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("WaitingRoom");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "waitingRoom").setOrigin(0, 0);

        let corridor = this.add.rectangle(0, 0, 160, this.CANVAS_HEIGHT, 0x000, 0).setOrigin(0, 0);
        this.setInteractive(corridor);
        corridor.on("pointerdown", () => {
            this.gameManager.startCorridorScene();
        });

        let door = this.add.rectangle(1097, 430, 140, 370, 0x000, 0).setOrigin(0.5, 0.5);
        this.setInteractive(door);
        door.on("pointerdown", () => {
            this.gameManager.startOfficeScene();
        });
    }
}