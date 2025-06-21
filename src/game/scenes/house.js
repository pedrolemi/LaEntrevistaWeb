import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import TextArea from "../../framework/UI/textArea.js";
import Character from "../character.js";

export default class House extends LaEntrevistaBaseScene {
    /**
    * Escena de la casa
    * @extends BaseScene
    */
    constructor() {
        super("House", "House");
    }

    create() {
        super.create();

        this.nodes = this.cache.json.get("house");
        this.node = this.dialogManager.readNodes(this, this.nodes, "scenes\\house", "start");

        this.BGS_X = 801;
        this.BGS_Y = 352;

        this.createBrowser();
        this.createDesktop();

        let img = this.add.image(0, 0, "blankScreen").setOrigin(0, 0);

        let errors = 0;
        this.dispatcher.add("wrongAnswer", this, () => {
            errors++;
            this.blackboard.setValue("errors", errors);
        });

        // this.dispatcher.dispatch("offersFound");

        let character = new Character(this, 200, 200, 0.5, "Antonio", 0.3, () => {
            console.log("Hola");
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
        portalLogo.on("pointerdown", () => { console.log("hello")})
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
        let portalText = new TextArea(this, 800, portalLogo.y, maxWidth, portalLogo.displayHeight, this.localizationManager.translate("platform", "scenes"), textConfig)
            .setOrigin(0, 0.5);
        portalText.adjustFontSize();


        this.dispatcher.add("offersFound", this, () => {
            portalLogo.setVisible(false);
            portalText.setVisible(false);

            let ICONS_Y = 300;
            let TEXT_Y = 450;
            textConfig.fontSize = 40;
            textConfig.fontFamily = 40;
            textConfig.fontFamily = "barlowCondensed-regular";
            textConfig.fontStyle = "normal";

            let programmingIcon = this.add.image(600, ICONS_Y, "programming");
            let programmingText = new TextArea(this, programmingIcon.x, TEXT_Y, programmingIcon.displayWidth, programmingIcon.displayHeight,
                this.localizationManager.translate("programming", "scenes").toUpperCase(), textConfig).setOrigin(0.5, 0.5);
            programmingText.adjustFontSize();

            this.setInteractive(programmingIcon);
            programmingIcon.on("pointerdown", () => {

            });


            let dataIcon = this.add.image(1005, ICONS_Y, "data");
            let dataText = new TextArea(this, dataIcon.x, TEXT_Y, dataIcon.displayWidth, dataIcon.displayHeight,
                this.localizationManager.translate("data", "scenes").toUpperCase(), textConfig).setOrigin(0.5, 0.5);
            dataText.adjustFontSize();

            this.setInteractive(dataIcon);
            dataIcon.on("pointerdown", () => {

            });
        });
    }


    createDesktop() {
        let desktop = this.add.image(this.BGS_X, this.BGS_Y, "desktop");

        this.dispatcher.add("startSearch", this, () => {
            this.setInteractive(desktop);
            desktop.on("pointerdown", () => {
                desktop.setVisible(false);
                desktop.disableInteractive();

                this.node = this.dialogManager.readNodes(this, this.nodes, "scenes\\house", "search");
                this.dialogManager.setNode(this.node);
            });
        });

    }
}