import QuestionBaseScene from "./questionBaseScene.js";
import Character from "../../character.js";

export default class Question4 extends QuestionBaseScene {
    constructor() {
        super("Question4");
    }

    create(params) {
        super.create(params);

        this.add.image(0, 0, "cafeteria").setOrigin(0, 0);
        new Character(this, 650, 740, 1.6, "Jesus", this.characterConfig.speed, false, () => { });
        new Character(this, 1050, 740, 1.7, "Pedro", this.characterConfig.speed, false, () => { });
    }
}