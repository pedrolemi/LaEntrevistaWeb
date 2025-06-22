import BaseUI from "../../framework/UI/baseUI.js";
import TextArea from "../../framework/UI/textArea.js";
import DialogManager from "../managers/dialogManager.js";
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
        this.dialogManager = DialogManager.getInstance();

        this.cv = new CV(this);
        this.cv.setDepth(10);

        this.dispatcher.add("checkCV", this, () => {
            this.cv.activate(true);
        });

        let QUESTION_TEXT_MARGIN = 10;
        this.QUESTION_TEXT_DEFAULT_SIZE = 50;

        let questionTextConfig = { ...this.textConfig };
        questionTextConfig.align = "center";
        questionTextConfig.strokeThickness = 5;
        questionTextConfig.stroke = "#000000";

        this.questionText = new TextArea(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2,
            this.CANVAS_WIDTH - QUESTION_TEXT_MARGIN * 2, this.CANVAS_HEIGHT / 2, "", questionTextConfig).setOrigin(0.5, 0.5);
        this.questionText.setVisible(false);
        this.questionText.setFontSize(this.QUESTION_TEXT_DEFAULT_SIZE);

        this.bgElements.add(this.questionText);


        // Si llega un evento de que se han acabado los nodos, desactiva la caja y quita el nodo del 
        this.dispatcher.remove(this, "endNodes");
        this.dispatcher.add("endNodes", this, () => {
            this.textbox.activate(false, () => {
                this.dialogManager.clearNodes();

                this.dialogManager.characters.forEach((character) => {
                    this.dialogManager.playDefaultAnimation(character);
                });
            });
        });
    }


    startTextNode(node) {
        if (this.cv.visible) {
            let fn = () => {
                super.startTextNode(node);
                this.cv.off("pointerdown", fn);
            }
            this.cv.on("pointerdown", fn);
        }
        else {
            // Si la caja era visible y el personaje anterior es distinto al actual,
            // se desactiva la caja y se vuelve a activar con el nombre nuevo
            if (this.textbox.visible && this.textbox.lastCharacter != node.character) {
                this.textbox.activate(false, () => {
                    this.textbox.setName(node.name, node.character);
                    this.textbox.activate(true, () => {
                        // Se para la animacion del personaje 
                        this.dialogManager.playDefaultAnimation(node.character);
                        this.textbox.setDialog(node.name, node.dialogs[node.currDialog]);
                    });
                })
            }
            // Si no, si la caja no era visible o el personaje es el mismo, se activa
            // directamente con el nombre nuevo (si ya estaba activa, no hara la animacion)
            else {
                this.textbox.setName(node.name, node.character);
                this.textbox.activate(true, () => {
                    this.textbox.setDialog(node.name, node.character, node.dialogs[node.currDialog]);
                });
            }
        }
    }

    skipDialog() {
        // Si no se ha terminado de mostrar todo el dialogo, lo muestra de golpe
        if (!this.textbox.finished) {
            this.textbox.forceFinish();
        }
        // Si se ha pasado el retardo para poder saltar el dialogo, se pasa al siguiente
        else if (this.textbox.canSkip) {
            this.dispatcher.dispatch("nextDialog");
        }
    }


    createOptions(node) {
        super.createOptions(node);

        this.questionText.setVisible(true);
        if (this.textbox.textObj.text != "") {
            this.questionText.setText(this.textbox.textObj.text);
            this.questionText.setFontSize(this.QUESTION_TEXT_DEFAULT_SIZE);

            this.questionText.adjustFontSize();
            this.questionText.y = this.optionBoxes[0].getBounds().y / 2;
        }

        this.bgBlock.fillAlpha = 0.7;
    }

    onOptionRemoval() {
        if (this.optionBoxes.length <= 0) {
            this.questionText.setVisible(false);
        }
        super.onOptionRemoval();
    }
}