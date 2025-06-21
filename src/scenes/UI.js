import BaseScene from "./gameLoop/baseScene.js";
import DialogManager from "../managers/dialogManager.js";
import LaEntrevistaNodeReader from "../dialog/laEntrevistaNodeReader.js";

import DialogBox from "../UI/dialogBox.js";
import CV from "../UI/cv.js";

export default class UI extends BaseScene {
    /**
    * Escena en la que se crean los elementos para la interfaz
    * @extends BaseScene
    */
    constructor() {
        super("UI", "UI");
    }

    create(params) {
        super.create(params);


        let dialogManager = DialogManager.create();
        dialogManager.init(this, new LaEntrevistaNodeReader());

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

        this.textbox = new DialogBox(this, false, this.textboxConfig, this.nameBoxConfig, this.textConfig, this.nameTextConfig);
        // this.textbox.activate(true);

        this.cv = new CV(this);
        this.cv.setDepth(10);

        this.dispatcher.add("checkCV", this, () => {
            this.cv.activate(true);
        }, true);

    }

}