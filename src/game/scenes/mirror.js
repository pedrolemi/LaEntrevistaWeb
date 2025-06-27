import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";
import InteractiveContainer from "../../framework/UI/interactiveContainer.js";
import TextArea from "../../framework/UI/textArea.js";

export default class Mirror extends LaEntrevistaBaseScene {
    /**
    * Escena del pasillo
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("Mirror");
    }

    create() {
        super.create();

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
        let transition = new InteractiveContainer(this, 0, 0);
        let transitionBg = this.add.image(0, 0, "30min").setOrigin(0, 0);
        let transitionText = new TextArea(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH, this.CANVAS_HEIGHT - TEXT_PADDING * 2,
            this.localizationManager.translate("30min", "scenes"), transitionTextConfig).setOrigin(0.5, 0.5);
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
            console.log("hey")
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
                    node = this.dialogManager.readNodes(this, nodes, namespace, "end");
                    this.dialogManager.setNode(node);
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
        let button = new InteractiveContainer(this, 0, 0);
        let img = this.add.image(x, y, "questionButton").setOrigin(0.5, 0.5).setScale(1.3);
        let txt = new TextArea(this, img.x, img.y, img.displayWidth, img.displayHeight, index, style).setOrigin(0.5, 0.5).setScale(img.scale);
        txt.adjustFontSize();

        button.add(img);
        button.add(txt);

        button.calculateRectangleSize();
        button.setInteractive();

        pageObj.add(button);

        // Configuracion de las animaciones
        let tintFadeTime = 50;
        let noTintColor = "#ffffff";
        let pointerOverColor = "#d9d9d9"
        let offColor = "#919191"

        let noTint = Phaser.Display.Color.HexStringToColor(noTintColor);
        let pointerOver = Phaser.Display.Color.HexStringToColor(pointerOverColor);
        let off = Phaser.Display.Color.HexStringToColor(offColor);

        // Hace fade del color de la caja al pasar o quitar el raton por encima
        button.on('pointerover', () => {
            this.tweens.addCounter({
                targets: [img, txt],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(noTint, pointerOver, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    img.setTint(colInt);
                    txt.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });
        button.on('pointerout', () => {
            this.tweens.addCounter({
                targets: [img, txt],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pointerOver, noTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    img.setTint(colInt);
                    txt.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        // Al hacer click, vuelve a cambiar el color de la caja al original y llama al onclick al terminar la animacion
        button.on('pointerdown', () => {
            let fadeColor = this.tweens.addCounter({
                targets: [img, txt],
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pointerOver, off, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    img.setTint(colInt);
                    txt.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0
            });
            if (!this.gameManager.sceneManager.fading) {
                button.disableInteractive();

                fadeColor.on('complete', () => {
                    this.gameManager.startQuestionScene(index);
                    this.gameManager.nQuestionsCompleted++;
                });
            }
        });

        return button;
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