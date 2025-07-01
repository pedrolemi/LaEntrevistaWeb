import QuestionBaseScene from "./questionBaseScene.js";
import Character from "../../character.js";

export default class Question2 extends QuestionBaseScene {
    constructor() {
        super("Question2");
    }

    create(params) {
        super.create(params);

        this.add.image(0, 0, "waitingRoom").setOrigin(0, 0);
        new Character(this, 785, 839, 1.7, "Antonio", this.characterConfig.speed, false, () => { });
    }
}