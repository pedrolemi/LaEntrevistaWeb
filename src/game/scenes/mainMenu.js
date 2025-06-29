import InteractiveContainer from "../../framework/UI/interactiveContainer.js";
import TextArea from "../../framework/UI/textArea.js";
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
        

        let namespace = "scenes";

        let playButton = this.createButton(586, 431, 313, 234, 3.6, this.localizationManager.translate("play", namespace).toUpperCase());
        let creditsButton = this.createButton(471, 854, 263, 215, 14.11, this.localizationManager.translate("credits", namespace).toUpperCase());
        
        playButton.on("pointerdown", () => {
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
            this.gameManager.startCreditsScene();

            // playButton.activate(false);
            // creditsButton.activate(false);
            
            // creditsVideo.setVisible(true);
            // creditsVideo.play();
        });
    }

    createButton(x, y, width, height, rotation, text) {
        let TEXT_MARGIN = 25;
        let INFO_TEXT_CONFIG = {
            fontFamily: "leagueSpartan-variable",
            fontSize: 100,
            fontStyle: "normal",
            color: "#000000",
            align: "center",
        };
        
        let button = new InteractiveContainer(this, 0, 0);
        let rect = this.add.rectangle(0, 0, width, height, 0xFFFFFF, 1).setOrigin(0.5, 0.5);
        let textObj = new TextArea(this, rect.x, rect.y, rect.displayWidth - TEXT_MARGIN * 2, rect.displayHeight - TEXT_MARGIN * 2, 
            text, INFO_TEXT_CONFIG).setOrigin(0.5, 0.5);
        textObj.adjustFontSize();

        button.add(rect);
        button.add(textObj);
        button.calculateRectangleSize();

        button.setAngle(rotation);
        button.setPosition(x, y);
        button.setInteractive();

        return button;
    }
}