import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";
import AnimatedContainer from "../../../framework/UI/animatedContainer.js";
import InteractiveContainer from "../../../framework/UI/interactiveContainer.js";
import TextArea from "../../../framework/UI/textArea.js";
import ImageTextButton from "../../../framework/UI/imageTextButton.js";
import { fadeAnimation, growAnimation, tintAnimation } from "../../../framework/utils/graphics.js";

export default class Mirror extends LaEntrevistaBaseScene {
    /**
    * Escena del pasillo
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("Mirror");
    }

    create(params) {
        super.create(params);

        let nodes = this.cache.json.get("mirror");
        let namespace = "scenes\\mirror";
        let node = this.localizationManager.readNodes(this, nodes, namespace, "start");

        let white = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0xFFFFFF, 1).setOrigin(0, 0);
        let playerChar = new Character(this, 845, 750, 1.7, "Alex", this.characterConfig.speed, false);
        let bg = this.add.image(0, 0, "mirror").setOrigin(0, 0);
        let effect = this.add.image(0, 0, "mirrorEffect").setOrigin(0, 0).setAlpha(0.6);

        let sceneElements = new AnimatedContainer(this, 0, 0);
        sceneElements.setOrigin(0, 0);
        sceneElements.add(white);
        sceneElements.add(playerChar);
        sceneElements.add(bg);
        sceneElements.add(effect);

        let transitionTextConfig = {
            fontFamily: "lexend-variable",
            fontSize: 130,
            fontStyle: 600,
            align: "center",
            stroke: "#000",
            strokeThickness: 10
        }
        const TEXT_PADDING = 50;
        if (!params.fromMenu) {
            let transition = new InteractiveContainer(this, 0, 0);
            transition.setOrigin(0, 0);
            let transitionBg = this.add.image(0, 0, "30min").setOrigin(0, 0);

            let transitionText = new TextArea(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH, this.CANVAS_HEIGHT,
                this.localizationManager.translate("30min", "scenes"), transitionTextConfig, 0.5, 0.5, TEXT_PADDING, TEXT_PADDING);
            transitionText.adjustFontSize();

            transition.add(transitionBg);
            transition.add(transitionText);
            transition.calculateRectangleSize();

            transition.setInteractive();
            transition.on("pointerdown", () => {
                // TRACKER EVENT
                this.trackerManager.sendAccessCutscene("30minTransition");

                transition.activate(false, () => {
                    this.localizationManager.setNode(node);
                });
            });
        }
        else {
            setTimeout(() => {
                this.dispatcher.dispatch("showQuestions");
            }, 100);
        }


        const ANIM_TIME = 200;
        const BLUR_STRENGTH = 2;
        let blur = null;
        let questions = this.createQuestionButtons(params.fromMenu);
        questions.setVisible(false);
        this.dispatcher.add("showQuestions", this, () => {
            // TRACKER EVENT
            this.gameManager.questionsStage.initialize();

            blur = sceneElements.postFX.addBlur();
            this.tweens.add({
                targets: blur,
                strength: { from: 0, to: BLUR_STRENGTH },
                duration: ANIM_TIME,
                repeat: 0
            });

            fadeAnimation(questions, transitionTextConfig, ANIM_TIME);
        });

        this.dispatcher.add("allQuestionsComplete", this, () => {
            let anim = this.tweens.add({
                targets: blur,
                strength: { from: BLUR_STRENGTH, to: 0 },
                duration: ANIM_TIME,
                repeat: 0
            });
            fadeAnimation(questions, false, ANIM_TIME);

            anim.on("complete", () => {
                setTimeout(() => {
                    if (!params.fromMenu) {
                        node = this.localizationManager.readNodes(this, nodes, namespace, "end");
                        this.localizationManager.setNode(node);
                    }
                    else {
                        this.gameManager.startCreditsScene();
                    }
                }, ANIM_TIME);
            });
        });

        this.dispatcher.add("end", this, () => {
            this.gameManager.startCreditsScene();
        });

    }


    createQuestionButtons(fromMenu) {
        let textConfig = {
            fontFamily: "lexend-variable",
            fontSize: 70,
            fontStyle: 600,
            align: "center",
            stroke: "#000",
            strokeThickness: 10
        }
        const TOP = 273;
        const BOTTOM = 626;
        const BUTTON_SPACING = 335

        let page1 = this.add.container(0, 0);

        let page1Button = this.add.image(this.CANVAS_WIDTH - 100, this.CANVAS_HEIGHT / 2, "uiElements", "questionArrow").setOrigin(0.5, 0.5).setScale(1.7);
        page1.add(page1Button);

        this.createQuestionButton(page1, 1, this.CANVAS_WIDTH / 2 - BUTTON_SPACING, TOP, textConfig, fromMenu);
        this.createQuestionButton(page1, 2, this.CANVAS_WIDTH / 2 + BUTTON_SPACING, TOP, textConfig, fromMenu);
        this.createQuestionButton(page1, 3, this.CANVAS_WIDTH / 2 - BUTTON_SPACING, BOTTOM, textConfig, fromMenu);
        this.createQuestionButton(page1, 4, this.CANVAS_WIDTH / 2 + BUTTON_SPACING, BOTTOM, textConfig, fromMenu);


        let page2 = this.add.container(0, 0);

        let page2Button = this.add.image(100, this.CANVAS_HEIGHT / 2, "uiElements", "questionArrow").setOrigin(0.5, 0.5).setScale(1.7);
        page2Button.setFlipX(true);
        page2.add(page2Button);

        this.createQuestionButton(page2, 5, this.CANVAS_WIDTH / 2 - BUTTON_SPACING, TOP, textConfig, fromMenu);
        this.createQuestionButton(page2, 6, this.CANVAS_WIDTH / 2, TOP, textConfig, fromMenu);
        this.createQuestionButton(page2, 7, this.CANVAS_WIDTH / 2 + BUTTON_SPACING, TOP, textConfig, fromMenu);
        this.createQuestionButton(page2, 8, this.CANVAS_WIDTH / 2 - BUTTON_SPACING / 2, BOTTOM, textConfig, fromMenu);
        this.createQuestionButton(page2, 9, this.CANVAS_WIDTH / 2 + BUTTON_SPACING / 2, BOTTOM, textConfig, fromMenu);

        page2.setVisible(false);

        growAnimation(page1Button, page1Button, () => {
            page1.setVisible(false);
            page2.setVisible(true);
        }, true, false, 1.1, true, 50);
        growAnimation(page2Button, page2Button, () => {
            page2.setVisible(false);
            page1.setVisible(true);
        }, true, false, 1.1, true, 50);

        let questions = this.add.container(0, 0);
        questions.add(page1);
        questions.add(page2);

        return questions;
    }

    createQuestionButton(pageObj, index, x, y, style, fromMenu) {
        let button = new ImageTextButton(this, x, y, index, style, () => {
            if (!this.gameManager.sceneManager.fading) {
                button.disableInteractive();
                this.gameManager.startQuestionScene(fromMenu, index);

                // TRACKER EVENT
                this.gameManager.questionsStage.progress();

                Phaser.Actions.SetTint(button.list, 0x969696);
            }
        }, "uiElements", "questionButton", 0.5, 0.5, 1.4, 1.4);
        tintAnimation(button, button.list, button.onClick, true);

        pageObj.add(button);
    }

}