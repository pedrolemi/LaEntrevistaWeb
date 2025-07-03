import TextArea from "../../framework/UI/textArea.js";
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

        let bg = this.add.image(0, 0, "credits").setOrigin(0, 0);

        let titlesNamespace = "creditsTitles";
        let names = this.cache.json.get("creditsNames");

        let textParams = [
            { key: "directors", ns: titlesNamespace },
            { key: "director1", ns: names },
            { key: "director2", ns: names },
            
            { key: "development", ns: titlesNamespace },
            { key: "developer", ns: names },

            { key: "idea", ns: titlesNamespace },
            { key: "idea1", ns: names },
            { key: "idea2", ns: names },
            { key: "idea3", ns: names },

            { key: "art", ns: titlesNamespace },
            { key: "artist", ns: names },

            { key: "port", ns: titlesNamespace },
            { key: "port1", ns: names },
            { key: "port2", ns: names },

            { key: "frLocalization", ns: titlesNamespace },
            { key: "fr1", ns: names },
        ]

        this.TEXT_MARGIN = 40;
        let TEXT_SPACING = 13;
        
        let START_Y = 70;
        let LIMIT_Y = 740;
        // let LIMIT_Y = 600;
        let MAX_HEIGHT = LIMIT_Y - START_Y - TEXT_SPACING;
        
        
        let textsContainer = this.add.container(this.calculatePosition(START_Y).x + this.TEXT_MARGIN, START_Y);
        let textObj = null;
        textParams.forEach((param) => {
            let y = START_Y;
            if (textObj != null) {
                y = textObj.y + textObj.displayHeight + TEXT_SPACING;
            }

            let textConfig = this.TITLES_TEXT_CONFIG;
            let text = "";
            if (param.ns == titlesNamespace) {
                text = this.localizationManager.translate(param.key, titlesNamespace) + ":";
                if (textObj != null) {
                    y += TEXT_SPACING;
                }
            }
            else {
                textConfig = this.INFO_TEXT_CONFIG;
                text = names[param.key];
            }
            
            textObj = this.createText(y, text, textConfig).setOrigin(0, 0);
            textsContainer.add(textObj);

        });

        let dims = textsContainer.getBounds();
        textsContainer.setSize(dims.width, dims.height);

        textsContainer.list.forEach((child) => {
            let matrix = child.getWorldTransformMatrix();
            // console.log(child.y)
            // console.log(matrix.ty)
            child.x -= (matrix.tx - child.x);
            child.y -= (matrix.ty - child.y);
        });

        if (dims.height > MAX_HEIGHT) {
            let scale = MAX_HEIGHT / dims.height;
            let prevWidth = dims.width;
            let prevScale = textsContainer.scale;
            textsContainer.setScale(scale);
        }

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
        let txt = new TextArea(this, pos.x + this.TEXT_MARGIN, y, pos.width - (this.TEXT_MARGIN * 2), style.fontSize * 2, text,
            style, this.sys.game.debug.enable);
        txt.setOrigin(0, 0);
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