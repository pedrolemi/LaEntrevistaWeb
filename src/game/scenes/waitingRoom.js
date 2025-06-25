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
    }
}