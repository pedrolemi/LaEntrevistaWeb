import QuestionBaseScene from "./questionBaseScene.js";
import Character from "../../character.js";

export default class Question3 extends QuestionBaseScene {
    constructor() {
        super("Question3");
    }

    create(params) {
        super.create(params);

        this.add.image(0, 0, "waitingRoom").setOrigin(0, 0);
        new Character(this, 850, 400, 1.7, "Jaime", this.characterConfig.speed, false, () => { });
    }
}