import QuestionBaseScene from "./questionBaseScene.js";
import Character from "../../character.js";

export default class Question5 extends QuestionBaseScene {
    constructor() {
        super("Question5");
    }

    create(params) {
        super.create(params);

        this.add.image(0, 0, "cafeteria").setOrigin(0, 0);
        new Character(this, 450, 700, 1.6, "Monica", this.characterConfig.speed, false, () => { });
        new Character(this, 800, 700, 1.6, "Rebeca", this.characterConfig.speed, false, () => { });
        new Character(this, 1250, 700, 1.7, "Carlos", this.characterConfig.speed, false, () => { });
    }
}