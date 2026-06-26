import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import AnimatedContainer from "../../../framework/UI/animatedContainer.js";
import InteractiveContainer from "../../../framework/UI/interactiveContainer.js";
import TextArea from "../../../framework/UI/textArea.js";
import RectTextButton from "../../../framework/UI/rectTextButton.js";
import { fadeAnimation, tintAnimation } from "../../../framework/utils/graphics.js";

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
            if (!this.gameManager.sceneManager.fading) {
                this.makeInactive();
                
                let anim = fadeAnimation(blankScreen, false, 200);
                anim.on("complete", () => {
                    setTimeout(() => {
                        this.gameManager.startGame();
                    }, 500);
                });
                // playButton.activate(false);
                // creditsButton.activate(false);

                // startVideo.setVisible(true);
                // startVideo.play();
            }
        });

        creditsButton.on("pointerdown", () => {
            if (!this.gameManager.sceneManager.fading) {
                this.makeInactive();

                this.gameManager.startCreditsScene();

                // playButton.activate(false);
                // creditsButton.activate(false);

                // creditsVideo.setVisible(true);
                // creditsVideo.play();
            }
        });

        questionsButton.on("pointerdown", () => {
            // TRACKER EVENT
            this.trackerManager.sendInteractGameObject("finalQuestionsButton", false,
                { "gameCompleted": this.gameManager.gameCompleted });

            if (!this.gameManager.sceneManager.fading) {
                if (!this.gameManager.gameCompleted) {
                    popup.activate(true);
                }
                else {
                    this.makeInactive();
                    this.gameManager.startMirrorScene(true);
                }
            }
        });
    }

    createGameButton(x, y, width, height, rotation, text) {
        let button = new InteractiveContainer(this, 0, 0);
        button.setOrigin(0.5, 0.5);
        let rect = this.add.rectangle(0, 0, width, height, 0xFFFFFF, 1).setOrigin(0.5, 0.5);
        let textObj = new TextArea(this, rect.x, rect.y, rect.displayWidth, rect.displayHeight, text, this.TEXT_CONFIG, 0.5, 0.5, this.TEXT_MARGIN, this.TEXT_MARGIN);
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
        const POPUP_SCALE = 0.5;

        let popup = new AnimatedContainer(this, 0, 0);
        popup.setOrigin(0, 0);
        let blackBg = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000000, 0.5).setOrigin(0, 0);

        let textRect = this.add.rectangle(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, this.CANVAS_WIDTH * POPUP_SCALE, this.CANVAS_HEIGHT * POPUP_SCALE, 0xFFFFFF, 1)
            .setOrigin(0.5, 0.5);

        let warningTitleY = textRect.y - textRect.displayHeight / 2 + this.TEXT_MARGIN * 1.5;
        let warningTitleMaxWidth = textRect.displayWidth - this.TEXT_MARGIN * 2;
        let warningTitleMaxHeight = textRect.displayHeight * 0.15;
        let warningTitleText = new TextArea(this, textRect.x, warningTitleY, warningTitleMaxWidth, warningTitleMaxHeight,
            this.localizationManager.translate("questionsWarningTitle", namespace), this.TEXT_CONFIG, 0.5, 0);
        warningTitleText.adjustFontSize();


        let warningTextConfig = { ...this.TEXT_CONFIG };
        warningTextConfig.wordWrap = {
            width: textRect.displayWidth - this.TEXT_MARGIN * 2,
            useAdvancedWrap: true
        }

        let warningTextY = warningTitleY + warningTitleMaxHeight + this.TEXT_MARGIN / 2;
        let warningTextMaxWidth = textRect.displayWidth - this.TEXT_MARGIN;
        let warningTextMaxHeight = textRect.displayHeight * 0.5 - this.TEXT_MARGIN;
        let warningText = new TextArea(this, textRect.x, warningTextY, warningTextMaxWidth, warningTextMaxHeight,
            this.localizationManager.translate("questionsWarning", namespace), warningTextConfig);
        warningText.adjustFontSize();
        warningText.y += warningText.displayHeight / 2;

        let buttonsY = warningTextY + warningTextMaxHeight + this.TEXT_MARGIN / 2;
        let buttonsHeight = textRect.displayHeight - (warningTitleMaxHeight + warningTextMaxHeight + this.TEXT_MARGIN * 4);
        let buttonsWidth = buttonsHeight * 3.2;

        let yesButton = new RectTextButton(this, textRect.x - textRect.displayWidth / 4, buttonsY, buttonsWidth, buttonsHeight,
            this.localizationManager.translate("yes", namespace), this.TEXT_CONFIG, () => {
                // TRACKER EVENT
                this.trackerManager.sendSelectAccessFinalQuestions(true);

                this.gameManager.startMirrorScene(true);
            }, "yesButton", 0.5, 0, 25, 0xe02424);
        tintAnimation(yesButton, yesButton.list, yesButton.onClick, true);
        
        let noButton = new RectTextButton(this, textRect.x + textRect.displayWidth / 4, buttonsY, buttonsWidth, buttonsHeight,
            this.localizationManager.translate("no", namespace), this.TEXT_CONFIG, () => {
                // TRACKER EVENT
                this.trackerManager.sendSelectAccessFinalQuestions(false);

                noButton.disableInteractive();
                popup.activate(false, () => {
                    noButton.setInteractive();
                });
            }, "noButton", 0.5, 0, 25, 0x36b030);
        tintAnimation(noButton, noButton.list, noButton.onClick, true);

        popup.add(blackBg);
        popup.add(textRect);
        popup.add(warningTitleText);
        popup.add(warningText);
        popup.add(yesButton);
        popup.add(noButton);

        blackBg.setInteractive();

        return popup;
    }
}