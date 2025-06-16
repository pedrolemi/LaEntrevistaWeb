import DialogBox from "../dialog/UI/dialogBox.js";
import OptionBox from "../dialog/UI/optionBox.js";
import DialogManager from "../managers/dialogManager.js";

export default class UI extends Phaser.Scene {
    /**
    * Escena en la que se crean los elementos para la interfaz
    * @extends Phaser.Scene
    */
    constructor() {
        super({ key: "UI" });
    }

    create() {
        // TOOD: Cambiar imagenes y configurar texto
        this.textboxConfig = {
            img: "textbox",
        }
        this.nameBoxConfig = {
            img: "",
        }
        this.textConfig = {
            fontSize: "25px",
            fontStyle: "bold"
        }
        this.nameTextConfig = {
            fontSize: "35px",
            fontStyle: "bold"
        }
        this.optionBoxConfig = {

        }

        this.textbox = new DialogBox(this, false, this.textboxConfig, this.nameBoxConfig, this.textConfig, this.nameTextConfig);

        let dialogManager = DialogManager.create();
        dialogManager.init(this);

        // TODO: Hacer el bloqueo de fondo
    }
}