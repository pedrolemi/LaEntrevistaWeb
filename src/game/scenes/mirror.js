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
        // let TEXT_PADDING = 50;
        // let transition = new InteractiveContainer(this, 0, 0);
        // let transitionBg = this.add.image(0, 0, "30min").setOrigin(0, 0);
        // let transitionText = new TextArea(this, this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH, this.CANVAS_HEIGHT - TEXT_PADDING * 2,
        //     this.localizationManager.translate("30min", "scenes"), transitionTextConfig).setOrigin(0.5, 0.5);
        // transitionText.adjustFontSize();

        // transition.add(transitionBg);
        // transition.add(transitionText);
        // transition.calculateRectangleSize();

        // // transition.setInteractive();
        // transition.on("pointerdown", () => {
        //     transition.activate(false, () => {
        //         // this.dialogManager.setNode(node);
        //     });
        // });

        this.dispatcher.add("showQuestions", this, () => {
            let blur = sceneElements.postFX.addBlur(0);
            this.tweens.add({
                targets: blur,
                strength: 2,
                duration: 500,
                yoyo: false,
                repeat: 0
            });
        })


        // Hace la animacion
        // this.tweens.add({
        //     targets: sceneElements,
        //     blur: { from: 0, to: 1 },
        //     duration: 500,
        //     repeat: 0,
        // });
        // ;

        // let img = this.add.image(500, 500, "questionButton").setOrigin(0.5, 0.5);

        this.createQuestionButtons();
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
        this.createQuestionButton(0, 500, 500, textConfig);
    }

    createQuestionButton(index, x, y, style) {
        let button = new InteractiveContainer(this, 0, 0);
        let img = this.add.image(x, y, "questionButton").setOrigin(0.5, 0.5);
        let txt = new TextArea(this, img.x, img.y, img.displayWidth, img.displayHeight, index, style).setOrigin(0.5, 0.5);
        txt.adjustFontSize();

        button.add(img);
        button.add(txt);

        button.calculateRectangleSize();
        button.setInteractive();
        

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
            button.disableInteractive();

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
            fadeColor.on('complete', () => {
                this.gameManager.startQuestionScene(index);
            });
        });
    }
}