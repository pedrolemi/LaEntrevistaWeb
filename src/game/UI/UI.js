import BaseUI from "../../framework/UI/baseUI.js";
import DialogManager from "../managers/dialogManager.js";
import TextArea from "../../framework/UI/textArea.js";
import CV from "../UI/cv.js"
import DefaultEventNames from "../../framework/utils/eventNames.js";

export default class UI extends BaseUI {
    constructor() {
        super("UI", "UI");
    }

    init(params) {
        super.init(params);

        this.textboxConfig = {
            img: "textbox",
            imgX: this.CANVAS_WIDTH * 0.49,
            imgY: this.CANVAS_HEIGHT * 0.83,
            textX: 180,
            textY: 715,
            realWidth: 1240,
            realHeight: 160,
        }
        this.nameBoxConfig = {
            img: "",
            textX: 385,
            textY: 634,
            realWidth: 320,
            realHeight: 60,
        }
        this.textConfig = {
            fontFamily: "lexend-variable",
            fontSize: 27,
            fontStyle: 600
        }
        this.nameTextConfig = {
            fontFamily: "lexend-variable",
            fontSize: 40,
            fontStyle: 600,
            align: "center"
        }
        this.optionBoxConfig = {
            boxSpacing: 10,
            textHorizontalPadding: 10,
            textVerticalPadding: 10,
        }
        this.optionsTextConfig = { ... this.textConfig };
        this.optionsTextConfig.fontSize = 35;

        this.QUESTION_TEXT_DEFAULT_SIZE = 50;
        let QUESTION_TEXT_MARGIN = 10;
        this.optionsQuestionTextConfig = { ...this.textConfig };
        this.optionsQuestionTextConfig.fontSize = this.QUESTION_TEXT_DEFAULT_SIZE;
        this.optionsQuestionTextConfig.align = "center";
        this.optionsQuestionTextConfig.wordWrap = {
            width: this.CANVAS_WIDTH - QUESTION_TEXT_MARGIN * 2,
            useAdvancedWrap: true
        }
        this.optionsQuestionTextConfig.stroke = "#000";
        this.optionsQuestionTextConfig.strokeThickness = 7;
    }

    create(params) {
        super.create(params);
        this.dialogManager = DialogManager.getInstance();

        this.cv = new CV(this);
        this.cv.setDepth(10);

        this.dispatcher.add("checkCV", this, () => {
            this.cv.activate(true);
        }, true);


        let questionTextConfig = { ...this.textConfig };
        questionTextConfig.align = "center";
        questionTextConfig.strokeThickness = 5;
        questionTextConfig.stroke = "#000000";

        this.questionText = new TextArea(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2,
            this.optionsQuestionTextConfig.wordWrap.width, this.CANVAS_HEIGHT / 2, "", this.optionsQuestionTextConfig).setOrigin(0.5, 0.5);
        this.questionText.setVisible(false);

        this.bgElements.add(this.questionText);

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
                    this.textbox.setDialog(node.name, node.character, node.dialogs[node.currDialog]);
                    this.textbox.activate(true);
                })
            }
            // Si no, si la caja no era visible o el personaje es el mismo, se activa
            // directamente con el nombre nuevo (si ya estaba activa, no hara la animacion)
            else {
                this.textbox.setDialog(node.name, node.character, node.dialogs[node.currDialog]);
                this.textbox.activate(true);
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
            this.dispatcher.dispatch(DefaultEventNames.nextDialog);
        }
    }


    createOptions(node) {
        super.createOptions(node);

        this.questionText.setVisible(true);
        // console.log(this.textbox.textObj.text)
        if (this.textbox.textObj.text != "") {
            this.questionText.setText(this.textbox.fullText);
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