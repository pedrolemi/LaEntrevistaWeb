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
        let namespace = "scenes\\corridor";

        let locationNode = this.dialogManager.readNodes(this, this.nodes, namespace, "locationInquiry");

        let exitPoint = {
            x: -100,
            y: 650
        };

        let textConfig = {
            fontFamily: "lexend-variable",
            fontSize: 35,
            fontStyle: "normal",
            color: "#ffffff",
            align: "right",
            stroke: "#000000",
            strokeThickness: 5
        }

        let posterConfig = {
            x: 575,
            maxWidth: 325,
            maxHeight: 90
        };

        let meetingRoomPosterConfig = {
            y: 216
        }
        this.createTextArea(posterConfig.x, meetingRoomPosterConfig.y, posterConfig.maxWidth, posterConfig.maxHeight,
            this.localizationManager.translate("meetingRoomPoster", "scenes"), textConfig);

        let cafeteriaPosterConfig = {
            y: 333
        }
        this.createTextArea(posterConfig.x, cafeteriaPosterConfig.y, posterConfig.maxWidth, posterConfig.maxHeight,
            this.localizationManager.translate("cafeteriaPoster", "scenes"), textConfig);

        // Luis
        let luisChar = new Character(this, 1200, 650, 1.5, "Luis", this.characterConfig.speed, false, null);
        luisChar.setOrigin(0.5, 0.5);
        this.dispatcher.addOnce("manLeave", this, () => {
            this.leaveRoom([luisChar], exitPoint);
        });

        this.dialogManager.setNode(locationNode);
    }

    createTextArea(x, y, maxWidth, maxHeight, text, style, originX = 1, originY = 0.5) {
        if (this.debug) {
            let rect = this.add.rectangle(x, y, maxWidth, maxHeight, 0x000000);
            rect.setOrigin(originX, originY);
        }
        this.skill1 = new TextArea(this, x, y, maxWidth, maxHeight, text, style).setOrigin(originX, originY);
        this.skill1.adjustFontSize();
    }
}