import QuestionBaseScene from "./questionBaseScene.js";
import Character from "../../character.js";

export default class Question8 extends QuestionBaseScene {
    constructor() {
        super("Question8");
    }

    create(params) {
        super.create(params);

        this.add.image(0, 0, "office").setOrigin(0, 0);
        new Character(this, 450, 850, 1.5, "Andres", this.characterConfig.speed, false, () => { });
        new Character(this, 1250, 770, 1.5, "Luisa", this.characterConfig.speed, false, () => { });
    }
}