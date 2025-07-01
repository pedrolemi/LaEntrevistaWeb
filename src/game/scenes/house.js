import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";

export default class House extends LaEntrevistaBaseScene {
    /**
    * Escena de la casa
    * @extends BaseScene
    */
    constructor() {
        super("House");
    }

    create() {
        super.create();

        this.namespace = "scenes\\house";
        this.nodes = this.cache.json.get("house");
        this.node = this.dialogManager.readNodes(this, this.nodes, this.namespace, "start");

        this.BGS_X = 801;
        this.BGS_Y = 352;

        this.createBrowser();
        this.createDesktop();

        let img = this.add.image(0, 0, "blankScreen").setOrigin(0, 0);

        this.blackboard.set("errors", 0);
        this.dispatcher.add("wrongAnswer", this, () => {
            let errors = this.blackboard.get("errors");
            this.blackboard.set("errors", errors + 1);
        });
    }

    onCreate() {
        setTimeout(() => {
            this.dialogManager.setNode(this.node);
        }, 500);
    }

    createBrowser() {
        let browser = this.add.image(this.BGS_X, this.BGS_Y, "browser");

        let portalLogo = this.add.image(565, this.BGS_Y, "portalLogo").setScale(0.55);
        portalLogo.setInteractive();
        let maxWidth = 450;
        let textConfig = {
            fontFamily: "Arial",
            fontSize: 75,
            fontStyle: "bold",
            color: "#000000",
            align: "left",
            wordWrap: {
                width: maxWidth,
                useAdvancedWrap: true
            }
        }
        let portalText = this.createTextArea(800, portalLogo.y, maxWidth, portalLogo.displayHeight, 0, 0.5,
             this.localizationManager.translate("platform", "scenes"), textConfig);
        portalText.adjustFontSize();


        this.dispatcher.add("offersFound", this, () => {
            this.createOffers(portalLogo, portalText, textConfig);
        });
    }

    createOffers(portalLogo, portalText, textConfig) {
        portalLogo.setVisible(false);
        portalText.setVisible(false);

        let ICONS_Y = 300;
        let TEXT_Y = 450;
        textConfig.fontSize = 40;
        textConfig.fontFamily = 40;
        textConfig.fontFamily = "barlowCondensed-regular";
        textConfig.fontStyle = "normal";

        let programmingIcon = this.add.image(600, ICONS_Y, "programming");
        let programmingText = this.createTextArea(programmingIcon.x, TEXT_Y, programmingIcon.displayWidth, programmingIcon.displayHeight, 0.5, 0.5,
            this.localizationManager.translate("programming", "scenes").toUpperCase(), textConfig);
        programmingText.adjustFontSize();
        this.setInteractive(programmingIcon);

        let dataIcon = this.add.image(1005, ICONS_Y, "data");
        let dataText = this.createTextArea(dataIcon.x, TEXT_Y, dataIcon.displayWidth, dataIcon.displayHeight, 0.5, 0.5,
            this.localizationManager.translate("data", "scenes").toUpperCase(), textConfig);
        dataText.adjustFontSize();
        this.setInteractive(dataIcon);

        programmingIcon.on("pointerdown", () => {
            this.gameManager.blackboard.set("position", "programming");

            this.node = this.dialogManager.readNodes(this, this.nodes, this.namespace, "selectOffer");
            this.dialogManager.setNode(this.node);
        });
        this.animateIcon(programmingIcon);

        dataIcon.on("pointerdown", () => {
            this.gameManager.blackboard.set("position", "dataScience");

            this.node = this.dialogManager.readNodes(this, this.nodes, this.namespace, "selectOffer");
            this.dialogManager.setNode(this.node);
        });
        this.animateIcon(dataIcon);

        this.dispatcher.add("updateCV", this, () => {
            programmingIcon.off("pointerdown");
            dataIcon.off("pointerdown");

            this.gameManager.startHallScene();
        });
    }

    createDesktop() {
        this.desktop = this.add.image(this.BGS_X, this.BGS_Y, "desktop");

        this.dispatcher.add("startSearch", this, () => {
            this.setInteractive(this.desktop);
            this.desktop.on("pointerdown", () => {
                if (this.dialogManager.currNode == null) {
                    this.desktop.setVisible(false);
                    this.desktop.disableInteractive();

                    this.node = this.dialogManager.readNodes(this, this.nodes, this.namespace, "search");
                    this.dialogManager.setNode(this.node);
                }
            });
        });

    }

    animateIcon(button) {
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