import BaseUI from "../../framework/UI/baseUI.js";
import TextArea from "../../framework/UI/textArea.js";
import CV from "../UI/cv.js"
import GameManager from "../managers/gameManager.js";
import AnimatedContainer from "../../framework/UI/animatedContainer.js";
import DefaultEventNames from "../../framework/utils/eventNames.js";
import RectTextButton from "../../framework/UI/rectTextButton.js";
import { createRectTexture, tintAnimation } from "../../framework/utils/graphics.js";

export default class UI extends BaseUI {
    constructor() {
        super("UI", "UI");
    }

    init(params) {
        super.init(params);

        this.textboxConfig = {
            imgAtlas: "uiElements",
            img: "textbox",
            imgX: this.CANVAS_WIDTH * 0.49,
            imgY: this.CANVAS_HEIGHT,
            imgOriginY: 1,
            textX: 180,
            textY: 715,
            realWidth: 1240,
            realHeight: 160,
        }
        this.nameBoxConfig = {
            img: "",
            textX: 385,
            textY: 642,
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
            imgAtlas: "uiElements",
            img: "optionBox",
            boxSpacing: 10,
            textPaddingX: 70,
            textPaddingY: 10,
            textOffsetX: 0,
            textOffsetY: 0,
        }
        this.optionsTextConfig = { ... this.textConfig };
        this.optionsTextConfig.fontSize = 35;
        this.optionsTextConfig.align = "center";
        this.optionsTextConfig.wordWrap = {
            width: 1,
            useAdvancedWrap: true
        }

        this.QUESTION_TEXT_DEFAULT_SIZE = 50;
        const QUESTION_TEXT_MARGIN = 10;
        this.optionsQuestionTextConfig = { ...this.optionsTextConfig };
        this.optionsQuestionTextConfig.fontSize = this.QUESTION_TEXT_DEFAULT_SIZE;
        this.optionsQuestionTextConfig.wordWrap.width = this.CANVAS_WIDTH - QUESTION_TEXT_MARGIN * 2;
        this.optionsQuestionTextConfig.stroke = "#000";
        this.optionsQuestionTextConfig.strokeThickness = 7;
    }

    create(params) {
        super.create(params);
        this.gameManager = GameManager.getInstance();

        
        this.cv = new CV(this);
        this.cv.setDepth(10);


        let questionTextConfig = { ...this.textConfig };
        questionTextConfig.align = "center";
        questionTextConfig.strokeThickness = 5;
        questionTextConfig.stroke = "#000000";

        this.darkBg = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000, 0.7).setOrigin(0, 0);
        this.questionText = new TextArea(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.optionsQuestionTextConfig.wordWrap.width, this.CANVAS_HEIGHT / 2,
            "", this.optionsQuestionTextConfig, 0.5, 0.5);

        this.questionBgElements = new AnimatedContainer(this, 0, 0);
        this.questionBgElements.setOrigin(0, 0);
        this.questionBgElements.add(this.darkBg);
        this.questionBgElements.add(this.questionText);
        this.questionBgElements.setVisible(false);

        
        this.pauseMenu = this.createPauseMenu("scenes");
        this.pauseMenu.setVisible(false);
        this.pauseMenu.setDepth(this.cv.depth + 1);


        this.dispatcher.add(DefaultEventNames.endDialogNodes, this, () => {
            this.questionBgElements.activate(false);
        });
    }

    onCreate() {
        this.enablePauseMenu(true);
    }

    shutdown() {
        super.shutdown();
        this.questionBgElements.activate(false);
        this.cv.activate(false);
    }

    createPauseMenu(namespace) {
        const RADIUS_PERCENTAGE = 5;

        let pauseMenu = new AnimatedContainer(this, 0, 0).setDepth(1);
        pauseMenu.setOrigin(0, 0);
        let blackBg = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000000, 0.5).setOrigin(0, 0);

        let textureId = "pauseMenu";
        createRectTexture(this, textureId, this.CANVAS_WIDTH * 0.3, this.CANVAS_HEIGHT * 0.6, 0x595757, 0.9, 5, 0x3d3a3a, 1, RADIUS_PERCENTAGE);
        let textRect = this.add.image(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, textureId);

        const TITLE_TEXT_CONFIG = {
            fontFamily: "leagueSpartan-variable",
            fontSize: 100,
            fontStyle: "normal",
            color: "#ffffff",
        };

        const TEXT_MARGIN = 27;
        const TITLE_MARGIN_Y = TEXT_MARGIN * 1.7;

        let pauseTitleY = textRect.y - textRect.displayHeight / 2 + TITLE_MARGIN_Y;
        let pauseTitleMaxWidth = textRect.displayWidth - TEXT_MARGIN * 2;
        let pauseTitleMaxHeight = textRect.displayHeight * 0.15;

        let pauseTitleText = new TextArea(this, textRect.x, pauseTitleY, pauseTitleMaxWidth, pauseTitleMaxHeight,
            this.localizationManager.translate("options", namespace), TITLE_TEXT_CONFIG, 0.5, 0);
        pauseTitleText.adjustFontSize();

        const BUTTON_CONFIG = {
            rectOriginX: 0.5,
            rectOriginY: 0,
            fillColor: 0xffffff,
            fillAlpha: 1,
            borderThickness: 3,
            borderColor: 0xa3a3a3,
            borderAlpha: 1,
            textOrigin: 0.5,
            textPadding: 20,
        }

        const TEXT_CONFIG = { ...TITLE_TEXT_CONFIG };
        TEXT_CONFIG.color = "#323232";

        let buttonsWidth = textRect.displayWidth - TEXT_MARGIN * 2;
        let buttonsHeight = (textRect.y + textRect.displayHeight / 2 -
            (pauseTitleY + pauseTitleMaxHeight + TITLE_MARGIN_Y + TEXT_MARGIN * 2 + TEXT_MARGIN * 1.5)) / 3;

        let makeVisible = (visible, onComplete) => {
            pauseMenu.activate(visible, () => {
                let currentScene = this.gameManager.sceneManager.getCurrentScene();
                if (visible) {
                    currentScene.scene.pause();
                }
                else {
                    currentScene.scene.resume();
                }
                this.time.paused = visible;
                if (onComplete != null && typeof onComplete === "function") {
                    onComplete();
                }
            });
        }

        let resumeButton = new RectTextButton(this, textRect.x, pauseTitleY + pauseTitleMaxHeight + TITLE_MARGIN_Y, buttonsWidth, buttonsHeight,
            this.localizationManager.translate("resume", namespace), TEXT_CONFIG, () => {
                resumeButton.disableInteractive();
                makeVisible(false, () => {
                    resumeButton.setInteractive();
                })
            }, "pauseButton", BUTTON_CONFIG.rectOriginX, BUTTON_CONFIG.rectOriginY, RADIUS_PERCENTAGE, BUTTON_CONFIG.fillColor, BUTTON_CONFIG.fillAlpha,
            BUTTON_CONFIG.borderThickness, BUTTON_CONFIG.borderColor, BUTTON_CONFIG.borderAlpha,
            BUTTON_CONFIG.textOrigin, BUTTON_CONFIG.textOrigin, BUTTON_CONFIG.textPadding, BUTTON_CONFIG.textPadding);
        tintAnimation(resumeButton, resumeButton.list, resumeButton.onClick, true);

        let menuButton = new RectTextButton(this, textRect.x, resumeButton.y + buttonsHeight + TEXT_MARGIN, buttonsWidth, buttonsHeight,
            this.localizationManager.translate("returnToMenu", namespace), TEXT_CONFIG, () => {
                // TRACKER EVENT
                this.trackerManager.sendCompleteGame(false);

                menuButton.disableInteractive();
                pauseMenu.disable();
                makeVisible(false, () => {
                    menuButton.setInteractive();
                    this.gameManager.startMainMenu();
                    this.shutdown();
                });
            }, "pauseButton", BUTTON_CONFIG.rectOriginX, BUTTON_CONFIG.rectOriginY, RADIUS_PERCENTAGE, BUTTON_CONFIG.fillColor, BUTTON_CONFIG.fillAlpha,
            BUTTON_CONFIG.borderThickness, BUTTON_CONFIG.borderColor, BUTTON_CONFIG.borderAlpha,
            BUTTON_CONFIG.textOrigin, BUTTON_CONFIG.textOrigin, BUTTON_CONFIG.textPadding, BUTTON_CONFIG.textPadding);
        tintAnimation(menuButton, menuButton.list, menuButton.onClick, true);

        let exitButton = new RectTextButton(this, textRect.x, menuButton.y + buttonsHeight + TEXT_MARGIN, buttonsWidth, buttonsHeight,
            this.localizationManager.translate("exit", namespace), TEXT_CONFIG, () => {
                // TRACKER EVENT
                this.trackerManager.sendCompleteGame(false);

                exitButton.disableInteractive();
                pauseMenu.disable();
                makeVisible(false, () => {
                    exitButton.setInteractive();
                    this.gameManager.startLanguageMenu();
                    this.shutdown();
                });
            }, "pauseButton", BUTTON_CONFIG.rectOriginX, BUTTON_CONFIG.rectOriginY, RADIUS_PERCENTAGE, BUTTON_CONFIG.fillColor, BUTTON_CONFIG.fillAlpha,
            BUTTON_CONFIG.borderThickness, BUTTON_CONFIG.borderColor, BUTTON_CONFIG.borderAlpha,
            BUTTON_CONFIG.textOrigin, BUTTON_CONFIG.textOrigin, BUTTON_CONFIG.textPadding, BUTTON_CONFIG.textPadding);
        tintAnimation(exitButton, exitButton.list, exitButton.onClick, true);

        pauseMenu.add(blackBg);
        pauseMenu.add(textRect);
        pauseMenu.add(pauseTitleText);
        pauseMenu.add(resumeButton);
        pauseMenu.add(menuButton);
        pauseMenu.add(exitButton);

        blackBg.setInteractive();

        let keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        pauseMenu.enable = () => {
            keyEsc.on("down", () => {
                makeVisible(!pauseMenu.visible);
            });
        }

        pauseMenu.disable = () => {
            makeVisible(false);
            keyEsc.off("down");
        }

        return pauseMenu;
    }

    enablePauseMenu(enabled) {
        if (enabled) {
            this.pauseMenu.enable();
        }
        else {
            this.pauseMenu.disable();
        }
    };

    startTextNode(node) {
        this.questionBgElements.activate(false);
        if (this.cv.visible) {
            let fn = () => {
                super.startTextNode(node);
                this.cv.off("pointerdown", fn);
            }
            this.cv.on("pointerdown", fn);
        }
        else {
            super.startTextNode(node);
        }
    }


    createOptions(node) {
        super.createOptions(node);

        if (this.textbox.textObj.text != "") {
            this.questionText.setText(this.textbox.fullText);
            this.questionText.setFontSize(this.QUESTION_TEXT_DEFAULT_SIZE);

            this.questionText.adjustFontSize();
            this.questionText.y = this.optionBoxes[0].getBounds().y / 2;
        }
        this.questionBgElements.activate(true);
    }

    removeOptions() {
        if (this.optionBoxes.length <= 0) {
            this.questionBgElements.activate(false);
        }
        super.removeOptions();
    }
}