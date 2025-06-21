import BaseScene from "./baseScene.js";
import DialogBox from "../UI/dialogBox.js"

export default class BaseUI extends BaseScene {
    /**
    * Clase base para la escena en la que se crean los elementos para la interfaz
    * @extends BaseScene
    */
    constructor(key = "UI") {
        super(key);

        this.textboxConfig = { }
        this.nameBoxConfig = { }
        this.textConfig = { }
        this.nameTextConfig = { }
        this.optionBoxConfig = { }
    }


    create(params) {
        super.create(params);

        this.dialogManager.scene = this;
        this.textbox = new DialogBox(this, false, this.textboxConfig, this.nameBoxConfig, this.textConfig, this.nameTextConfig);
    }
}