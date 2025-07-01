import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";

export default class Credits extends LaEntrevistaBaseScene {
    /**
    * Escena de la cafeteria
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("Credits");
    }

    create() {
        super.create();

        this.TITLES_TEXT_CONFIG = {
            fontFamily: "leagueSpartan-variable",
            fontSize: 30,
            fontStyle: "bold",
            color: "#000000",
            align: "left",
        }

        this.INFO_TEXT_CONFIG = {
            fontFamily: "leagueSpartan-variable",
            fontSize: 25,
            fontStyle: "normal",
            color: "#000000",
            align: "left",
        }

        this.TEXT_MARGIN = 40;
        let TEXT_SPACING = 13;

        let bg = this.add.image(0, 0, "credits").setOrigin(0, 0);

        let titlesNamespace = "creditsTitles";
        let namesNamespace = "creditsNames";

        let startY = 85;
        let txt = this.createText(startY, this.localizationManager.translate("directors", titlesNamespace), this.TITLES_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("director1", namesNamespace), this.INFO_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("director2", namesNamespace), this.INFO_TEXT_CONFIG);

        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING * 2, this.localizationManager.translate("development", titlesNamespace), this.TITLES_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("developer", namesNamespace), this.INFO_TEXT_CONFIG);

        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING * 2, this.localizationManager.translate("idea", titlesNamespace), this.TITLES_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("idea1", namesNamespace), this.INFO_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("idea2", namesNamespace), this.INFO_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("idea3", namesNamespace), this.INFO_TEXT_CONFIG);

        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING * 2, this.localizationManager.translate("art", titlesNamespace), this.TITLES_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("artist", namesNamespace), this.INFO_TEXT_CONFIG);

        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING * 2, this.localizationManager.translate("port", titlesNamespace), this.TITLES_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("port1", namesNamespace), this.INFO_TEXT_CONFIG);
        txt = this.createText(txt.y + txt.displayHeight + TEXT_SPACING, this.localizationManager.translate("port2", namesNamespace), this.INFO_TEXT_CONFIG);


        // let video = this.add.video(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "exitCreditsAnimation");
        // video.setVisible(false);

        // video.on("created", () => {
        //     // console.log(video.width)
        //     let scaleX = this.CANVAS_WIDTH / video.width;
        //     let scaleY = this.CANVAS_HEIGHT / video.height;
        //     let scale = Math.max(scaleX, scaleY);

        //     video.setScale(scale * 1.15);
        //     video.setPlaybackRate(3);
        // });
        // video.on("complete", () => {
        //     this.gameManager.startMainMenu(false);
        // });
        
        let ARROW_POS = 50;
        let returnButton = this.add.image(ARROW_POS, ARROW_POS, "questionArrow").setOrigin(0, 0);
        returnButton.setFlipX(true);
        this.setInteractive(returnButton);
        this.animateArrow(returnButton);
        
        returnButton.on("pointerdown", () => {
            this.gameManager.startMainMenu();
            // returnButton.setVisible(false);
            // video.setVisible(true);
            // video.play();
        });
    }


    createText(y, text, style) {
        let pos = this.calculatePosition(y);
        let txt = this.createTextArea(pos.x + this.TEXT_MARGIN, y, pos.width - (this.TEXT_MARGIN * 2), style.fontSize * 2, 0, 0, text, style);
        txt.adjustFontSize();
        return txt;
    }

    calculatePosition(y) {
        // Input points
        const y1 = 42, x1 = 485, width1 = 614;
        const y2 = 855, x2 = 443, width2 = 716;

        // Calculate slopes
        const xSlope = (x2 - x1) / (y2 - y1);
        const widthSlope = (width2 - width1) / (y2 - y1);

        // Calculate interpolated values
        const x = x1 + xSlope * (y - y1);
        const width = width1 + widthSlope * (y - y1);

        return { x, width };
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