import BaseUI from "../../framework/scenes/baseUI.js";
import CV from "../UI/cv.js"

export default class UI extends BaseUI {
    constructor() {
        super("UI", "UI");

        // TODO: Cambiar imagenes y configurar texto
        this.textboxConfig = {
            img: "textbox",
        }
        this.nameBoxConfig = {
            img: "",
        }
        this.textConfig = {
            fontFamily: "barlowCondensed-regular",
            fontSize: 35,
            fontStyle: "bold"
        }
        this.nameTextConfig = {
            fontFamily: "leagueSpartan-variable",
            fontSize: 40,
            fontStyle: "bold"
        }
        this.optionBoxConfig = {
        }
    }

    create(params) {
        super.create(params);

        this.cv = new CV(this);
        this.cv.setDepth(10);

        this.dispatcher.add("checkCV", this, () => {
            this.cv.activate(true);
        }, true);
    }


}