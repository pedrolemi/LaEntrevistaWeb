import QuestionBaseScene from "./questionBaseScene.js";
import Character from "../../character.js";

export default class Question1 extends QuestionBaseScene {
    constructor() {
        super("Question1");
    }

    create(params) {
        super.create(params);

        this.add.image(0, 0, "hall").setOrigin(0, 0);
        new Character(this, 950, 800, 1.5, "Ivan", this.characterConfig.speed, false, () => { });
    }
}