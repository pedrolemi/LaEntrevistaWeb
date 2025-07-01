import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";
import InteractiveContainer from "../../framework/UI/interactiveContainer.js";
import TextButton from "../../framework/UI/textButton.js";
import TextArea from "../../framework/UI/textArea.js";

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
        let node = this.dialogManager.readNodes(this, nodes, namespace, "start");

        let white = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0xFFFFFF, 1).setOrigin(0, 0);
        let playerChar = new Character(this, 845, 750, 1.7, "Alex", this.characterConfig.speed, false, () => { });
        let bg = this.add.image(0, 0, "mirror").setOrigin(0, 0);
        let effect = this.add.image(0, 0, "mirrorEffect").setOrigin(0, 0).setAlpha(0.6);

        let sceneElements = new InteractiveContainer(this, 0, 0);
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
        let TEXT_PADDING = 50;
        if (!params.skip) {
            let transition = new InteractiveContainer(this, 0, 0);
            let transitionBg = this.add.image(0, 0, "30min").setOrigin(0, 0);

            let transitionText = new TextArea(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH, this.CANVAS_HEIGHT - TEXT_PADDING * 2,
                this.localizationManager.translate("30min", "scenes"), transitionTextConfig, this.sys.game.debug.enable);
            transitionText.setOrigin(0.5, 0.5);
            transitionText.adjustFontSize();

            transition.add(transitionBg);
            transition.add(transitionText);
            transition.calculateRectangleSize();

            transition.setInteractive();
            transition.on("pointerdown", () => {
                transition.activate(false, () => {
                    this.dialogManager.setNode(node);
                });
            });
        }
        else {
            setTimeout(() => {
                this.dispatcher.dispatch("showQuestions");
            }, 100);
        }


        let ANIM_TIME = 200;
        let BLUR_STRENGTH = 2;
        let blur = null;
        let questions = this.createQuestionButtons();
        questions.setVisible(false);
        this.dispatcher.add("showQuestions", this, () => {
            blur = sceneElements.postFX.addBlur();
            this.tweens.add({
                targets: blur,
                strength: { from: 0, to: BLUR_STRENGTH },
                duration: ANIM_TIME,
                repeat: 0
            });

            questions.setVisible(true);
            this.tweens.add({
                targets: questions,
                alpha: { from: 0, to: 1 },
                duration: ANIM_TIME,
                repeat: 0
            });
        });

        this.dispatcher.add("allQuestionsComplete", this, () => {
            let anim = this.tweens.add({
                targets: blur,
                strength: { from: BLUR_STRENGTH, to: 0 },
                duration: ANIM_TIME,
                repeat: 0
            });
            this.tweens.add({
                targets: questions,
                alpha: { from: 1, to: 0 },
                duration: ANIM_TIME,
                repeat: 0
            });

            anim.on("complete", () => {
                setTimeout(() => {
                    if (!params.skip) {
                        node = this.dialogManager.readNodes(this, nodes, namespace, "end");
                        this.dialogManager.setNode(node);
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


    createQuestionButtons() {
        let textConfig = {
            fontFamily: "lexend-variable",
            fontSize: 70,
            fontStyle: 600,
            align: "center",
            stroke: "#000",
            strokeThickness: 10
        }
        let TOP = 273;
        let BOTTOM = 626;
        let BUTTON_SPACING = 335

        let page1 = this.add.container(0, 0);

        let page1Button = this.add.image(this.CANVAS_WIDTH - 100, this.CANVAS_HEIGHT / 2, "questionArrow").setOrigin(0.5, 0.5).setScale(1.7);
        this.setInteractive(page1Button);
        this.animateArrow(page1Button);
        page1.add(page1Button);

        this.createQuestionButton(page1, 1, this.CANVAS_WIDTH / 2 - BUTTON_SPACING, TOP, textConfig);
        this.createQuestionButton(page1, 2, this.CANVAS_WIDTH / 2 + BUTTON_SPACING, TOP, textConfig);
        this.createQuestionButton(page1, 3, this.CANVAS_WIDTH / 2 - BUTTON_SPACING, BOTTOM, textConfig);
        this.createQuestionButton(page1, 4, this.CANVAS_WIDTH / 2 + BUTTON_SPACING, BOTTOM, textConfig);


        let page2 = this.add.container(0, 0);

        let page2Button = this.add.image(100, this.CANVAS_HEIGHT / 2, "questionArrow").setOrigin(0.5, 0.5).setScale(1.7);
        page2Button.setFlipX(true);
        this.setInteractive(page2Button);
        this.animateArrow(page2Button);
        page2.add(page2Button);

        this.createQuestionButton(page2, 5, this.CANVAS_WIDTH / 2 - BUTTON_SPACING, TOP, textConfig);
        this.createQuestionButton(page2, 6, this.CANVAS_WIDTH / 2, TOP, textConfig);
        this.createQuestionButton(page2, 7, this.CANVAS_WIDTH / 2 + BUTTON_SPACING, TOP, textConfig);
        this.createQuestionButton(page2, 8, this.CANVAS_WIDTH / 2 - BUTTON_SPACING / 2, BOTTOM, textConfig);
        this.createQuestionButton(page2, 9, this.CANVAS_WIDTH / 2 + BUTTON_SPACING / 2, BOTTOM, textConfig);

        page2.setVisible(false);
        page1Button.on("pointerdown", () => {
            page1.setVisible(false);
            page2.setVisible(true);
        });
        page2Button.on("pointerdown", () => {
            page2.setVisible(false);
            page1.setVisible(true);
        });

        let questions = this.add.container(0, 0);
        questions.add(page1);
        questions.add(page2);

        return questions;
    }


    createQuestionButton(pageObj, index, x, y, style) {
        let button = new TextButton(this, x, y, 0, 0);
        button.createImgButton(index, style, () => {
            button.disableInteractive();
            this.gameManager.startQuestionScene(index);
            this.gameManager.nQuestionsCompleted++;
            button.image.setTint(0x969696);
            button.textObj.setTint(0x969696);
        }, "questionButton", 0.5, 0.5, 1.4, 1.4, 1, 0, 0, 0.5, 0.5, 0.5, 0.5);

        pageObj.add(button);
    }

    animateArrow(button) {
        let originalScale = button.scale;
        let scaleMultiplier = 1.1;

        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: originalScale * scaleMultiplier,
                duration: 0,
                repeat: 0,
            });
        });
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: originalScale,
                duration: 0,
                repeat: 0,
            });
        });
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scale: originalScale,
                duration: 20,
                repeat: 0,
                yoyo: true
            });
        });

    }
}