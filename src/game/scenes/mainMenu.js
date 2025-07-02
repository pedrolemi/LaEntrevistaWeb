import InteractiveContainer from "../../framework/UI/interactiveContainer.js";
import TextArea from "../../framework/UI/textArea.js";
import TextButton from "../../framework/UI/textButton.js";
import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";

export default class MainMenu extends LaEntrevistaBaseScene {
    /**
    * Menu principal
    * @extends BaseScene
    */
    constructor() {
        super("MainMenu");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "mainMenu").setOrigin(0, 0);
        let blankScreen = this.add.image(0, 0, "mainMenuBlank").setOrigin(0, 0);

        // let startVideo = this.add.video(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "startGameAnimation");
        // startVideo.setVisible(false);

        // let creditsVideo = this.add.video(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "enterCreditsAnimation");
        // creditsVideo.setVisible(false);

        // startVideo.on("created", () => {
        //     let scaleX = this.CANVAS_WIDTH / startVideo.width;
        //     let scaleY = this.CANVAS_HEIGHT / startVideo.height;
        //     let scale = Math.max(scaleX, scaleY);

        //     startVideo.setScale(scale * 1.15);
        //     startVideo.setPlaybackRate(3);
        // });
        // startVideo.on("complete", () => {
        //     this.gameManager.startGame();
        // });

        // creditsVideo.on("created", () => {
        //     // console.log(video.width)
        //     let scaleX = this.CANVAS_WIDTH / creditsVideo.width;
        //     let scaleY = this.CANVAS_HEIGHT / creditsVideo.height;
        //     let scale = Math.max(scaleX, scaleY);

        //     creditsVideo.setScale(scale * 1.15);
        //     creditsVideo.setPlaybackRate(3);
        // });
        // creditsVideo.on("complete", () => {
        //     this.gameManager.startCreditsScene(false);
        // });

        this.TEXT_MARGIN = 25;
        this.TEXT_CONFIG = {
            fontFamily: "leagueSpartan-variable",
            fontSize: 100,
            fontStyle: "normal",
            color: "#000000",
            align: "center",
        };

        let namespace = "scenes";

        let playButton = this.createGameButton(586, 431, 313, 234, 3.6, this.localizationManager.translate("play", namespace).toUpperCase());
        let creditsButton = this.createGameButton(471, 854, 263, 215, 14.11, this.localizationManager.translate("credits", namespace).toUpperCase());
        let questionsButton = this.createGameButton(205, 570, 355, 245, -12.2, this.localizationManager.translate("questions", namespace).toUpperCase());

        let popup = this.createPopup(namespace);
        popup.setVisible(false);

        this.makeInactive = () => {
            playButton.disableInteractive();
            creditsButton.disableInteractive();
            questionsButton.disableInteractive();
        }

        playButton.on("pointerdown", () => {
            this.makeInactive();

            let anim = this.tweens.add({
                targets: blankScreen,
                alpha: { from: 1, to: 0 },
                duration: 200,
                repeat: 0,
            });

            anim.on("complete", () => {
                setTimeout(() => {
                    this.gameManager.startHouseScene();
                }, 500);
            });
            // playButton.activate(false);
            // creditsButton.activate(false);

            // startVideo.setVisible(true);
            // startVideo.play();
        });

        creditsButton.on("pointerdown", () => {
            this.makeInactive();

            this.gameManager.startCreditsScene();

            // playButton.activate(false);
            // creditsButton.activate(false);

            // creditsVideo.setVisible(true);
            // creditsVideo.play();
        });

        questionsButton.on("pointerdown", () => {
            if (!this.gameManager.gameCompleted) {
                popup.activate(true);
            }
            else {
                this.makeInactive();
                this.gameManager.startMirrorScene(true);
            }
        });
    }

    createGameButton(x, y, width, height, rotation, text) {
        let button = new InteractiveContainer(this, 0, 0);
        let rect = this.add.rectangle(0, 0, width, height, 0xFFFFFF, 1).setOrigin(0.5, 0.5);
        let textObj = new TextArea(this, rect.x, rect.y, rect.displayWidth - this.TEXT_MARGIN * 2, rect.displayHeight - this.TEXT_MARGIN * 2, text,
            this.TEXT_CONFIG, this.sys.game.debug.enable);
        textObj.setOrigin(0.5, 0.5);
        textObj.adjustFontSize();

        let cross = this.add.rectangle(rect.x, rect.y, width * 0.95, height * 0.02, this.TEXT_CONFIG.color, 1).setOrigin(0.5, 0.5);
        cross.setVisible(false);

        button.add(rect);
        button.add(textObj);
        button.add(cross);
        button.calculateRectangleSize();

        button.setAngle(rotation);
        button.setPosition(x, y);
        button.setInteractive();

        button.on("pointerover", () => {
            cross.setVisible(true);
        });
        button.on("pointerout", () => {
            cross.setVisible(false);
        });

        return button;
    }

    createPopup(namespace) {
        let POPUP_SCALE = 0.5;

        let popup = new InteractiveContainer(this, 0, 0);
        let blackBg = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000000, 0.5).setOrigin(0, 0);

        // TODO: Cambiar
        let textRect = this.add.rectangle(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH * POPUP_SCALE, this.CANVAS_HEIGHT * POPUP_SCALE, 0xFFFFFF, 1)
            .setOrigin(0.5, 0.5);

        let warningTitleText = new TextArea(this, textRect.x, textRect.y - textRect.displayHeight / 2 + this.TEXT_MARGIN, textRect.displayWidth - this.TEXT_MARGIN * 2,
            textRect.displayHeight * 0.15, this.localizationManager.translate("questionsWarningTitle", namespace), this.TEXT_CONFIG, this.sys.game.debug.enable);
        warningTitleText.setOrigin(0.5, 0);
        warningTitleText.adjustFontSize();


        let warningTextConfig = { ...this.TEXT_CONFIG };
        warningTextConfig.wordWrap = {
            width: textRect.displayWidth - this.TEXT_MARGIN * 2,
            useAdvancedWrap: true
        }
        let warningText = new TextArea(this, textRect.x, warningTitleText.y + warningTitleText.displayHeight + this.TEXT_MARGIN, textRect.displayWidth - this.TEXT_MARGIN * 2,
            textRect.displayHeight * 0.5, this.localizationManager.translate("questionsWarning", namespace), warningTextConfig, this.sys.game.debug.enable);
        warningText.setOrigin(0.5, 0.5);
        warningText.adjustFontSize();
        warningText.y += warningText.displayHeight / 2;


        let buttonsY = warningText.y + warningText.displayHeight;
        let buttonsWidth = textRect.displayWidth / 2 - this.TEXT_MARGIN * 2;
        let buttonsHeight = warningTitleText.displayHeight * 1.5;

        let yesButton = new TextButton(this, textRect.x - buttonsWidth / 2 - this.TEXT_MARGIN / 2, buttonsY, buttonsWidth, buttonsHeight);
        yesButton.createRectButton(this.localizationManager.translate("yes", namespace), this.TEXT_CONFIG, () => {
            this.gameManager.startMirrorScene(true);
            yesButton.disableInteractive();
        }, "yesButton", 25, 0xe02424, 1, 5);

        let noButton = new TextButton(this, textRect.x + buttonsWidth / 2 + this.TEXT_MARGIN / 2, buttonsY, buttonsWidth, buttonsHeight);
        noButton.createRectButton(this.localizationManager.translate("no", namespace), this.TEXT_CONFIG, () => {
            noButton.disableInteractive();
            popup.activate(false, () => {
                noButton.setInteractive();
            });
        }, "noButton", 25, 0x36b030, 1, 5);

        popup.add(blackBg);
        popup.add(textRect);
        popup.add(warningTitleText);
        popup.add(warningText);
        popup.add(yesButton);
        popup.add(noButton);

        blackBg.setInteractive();

        popup.calculateRectangleSize();

        return popup;
    }

}