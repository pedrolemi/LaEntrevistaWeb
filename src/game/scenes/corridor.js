import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";
import TextArea from "../../framework/UI/textArea.js";

export default class Corridor extends LaEntrevistaBaseScene {
    /**
    * Escena de la casa
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("Corridor");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "corridor").setOrigin(0, 0);

        this.debug = false;

        this.nodes = this.cache.json.get("corridor");
        this.DIALOGS_NAMESPACE = "scenes\\corridor";

        let locationNode = this.dialogManager.readNodes(this, this.nodes, this.dialogsNamespace, "locationInquiry");

        this.TEXT_CONFIG = {
            fontFamily: "lexend-variable",
            fontSize: 35,
            fontStyle: "normal",
            color: "#ffffff",
            align: "right",
            stroke: "#000000",
            strokeThickness: 5
        }

        this.POSTER_CONFIG = {
            text: {
                x: 575,
                width: 325,
                height: 90,
                originX: 1,
                originY: 0.5
            },
            rect: {
                x: 393,
                width: 410,
                height: 105,
                originX: 0.5,
                originY: 0.5
            },
        }

        const NAMESPACE = "scenes";
        let posters = [
            {
                y: 216,
                id: "meetingRoomPoster"
            },
            {
                y: 333,
                id: "cafeteriaPoster"
            }
        ];

        posters.forEach(({ y, id }) => {
            this.createPoster(y, this.localizationManager.translate(id, NAMESPACE), id);
        });

        // Luis
        let exitPoint = {
            x: -100,
            y: 650
        };
        let luisChar = new Character(this, 1200, 650, 1.5, "Luis", this.characterConfig.speed, false, null);
        luisChar.setOrigin(0.5, 0.5);
        this.dispatcher.addOnce("manLeave", this, () => {
            this.leaveRoom([luisChar], exitPoint);
        });

        this.dialogManager.setNode(locationNode);
    }

    createPoster(y, text, objectNodeName) {
        if (this.debug) {
            let debugRect = this.add.rectangle(this.POSTER_CONFIG.text.x, y,
                this.POSTER_CONFIG.text.width, this.POSTER_CONFIG.text.height, 0x000000);
            debugRect.setOrigin(this.POSTER_CONFIG.text.originX, this.POSTER_CONFIG.text.originY);
        }
        let posterText = new TextArea(this, this.POSTER_CONFIG.text.x, y,
            this.POSTER_CONFIG.text.width, this.POSTER_CONFIG.text.height, text, this.TEXT_CONFIG)
        posterText.setOrigin(this.POSTER_CONFIG.text.originX, this.POSTER_CONFIG.text.originY);
        posterText.adjustFontSize();

        let posterNode = this.dialogManager.readNodes(this, this.nodes, this.DIALOGS_NAMESPACE, objectNodeName);

        let posterRect = this.add.zone(this.POSTER_CONFIG.rect.x, y,
            this.POSTER_CONFIG.rect.width, this.POSTER_CONFIG.rect.height);
        posterRect.setOrigin(this.POSTER_CONFIG.rect.originX, this.POSTER_CONFIG.rect.originY);

        this.setInteractive(posterRect);
        posterRect.on('pointerdown', () => {
            this.dialogManager.setNode(posterNode);
        });
    }
}