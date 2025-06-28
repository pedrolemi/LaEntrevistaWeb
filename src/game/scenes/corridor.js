import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";
import TextArea from "../../framework/UI/textArea.js";

export default class Corridor extends LaEntrevistaBaseScene {
    /**
    * Escena del pasillo
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

        let locationNode = this.dialogManager.readNodes(this, this.nodes, this.DIALOGS_NAMESPACE, "locationInquiry");

        this.TEXT_CONFIG = {
            fontFamily: "lexend-variable",
            fontSize: 35,
            fontStyle: "normal",
            color: "#ffffff",
            align: "right",
            stroke: "#000000",
            strokeThickness: 5
        }

        this.SIGN_CONFIG = {
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
        let signs = [
            {
                y: 216,
                id: "meetingRoomSign"
            },
            {
                y: 333,
                id: "cafeteriaSign"
            }
        ];

        signs.forEach(({ y, id }) => {
            this.createSign(y, this.localizationManager.translate(id, NAMESPACE), id);
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
        luisChar.once("targetReached", () => {
            let arrowScale = 0.5;
            let waitingRoomArrow = this.add.image(946, 658, "frontArrow").setOrigin(0.5, 0.5).setScale(arrowScale);
            let cafeteriaArrow = this.add.image(100, 540, "sideArrow").setOrigin(0.5, 0.5).setScale(arrowScale).setAngle(-90);

            this.tweens.add({
                targets: [waitingRoomArrow, cafeteriaArrow],
                alpha: { from: 0, to: 1 },
                duration: 200,
                repeat: 0
            });

            this.tweens.add({
                targets: [waitingRoomArrow, cafeteriaArrow],
                scale: { from: arrowScale, to: arrowScale * 1.2 },
                duration: 1000,
                repeat: -1,
                yoyo: true
            });
        })


        setTimeout(() => {
            this.dialogManager.setNode(locationNode);
            
            let cafeteria = this.add.rectangle(0, 0, 160, this.CANVAS_HEIGHT, 0x000, 0).setOrigin(0, 0);
            this.setInteractive(cafeteria);
            cafeteria.on("pointerdown", () => {
                this.gameManager.startCafeteriaScene();
            });

            let waitingRoom = this.add.rectangle(955, 475, 240, 470, 0x000, 0);
            this.setInteractive(waitingRoom);
            waitingRoom.on("pointerdown", () => {
                this.gameManager.startWaitingRoomScene();
            });
        }, 200);
    }

    createSign(y, text, objectNodeName) {
        if (this.debug) {
            let debugRect = this.add.rectangle(this.SIGN_CONFIG.text.x, y,
                this.SIGN_CONFIG.text.width, this.SIGN_CONFIG.text.height, 0x000000);
            debugRect.setOrigin(this.SIGN_CONFIG.text.originX, this.SIGN_CONFIG.text.originY);
        }
        let signText = new TextArea(this, this.SIGN_CONFIG.text.x, y,
            this.SIGN_CONFIG.text.width, this.SIGN_CONFIG.text.height, text, this.TEXT_CONFIG)
        signText.setOrigin(this.SIGN_CONFIG.text.originX, this.SIGN_CONFIG.text.originY);
        signText.adjustFontSize();

        let signNode = this.dialogManager.readNodes(this, this.nodes, this.DIALOGS_NAMESPACE, objectNodeName);

        let signRect = this.add.zone(this.SIGN_CONFIG.rect.x, y,
            this.SIGN_CONFIG.rect.width, this.SIGN_CONFIG.rect.height);
        signRect.setOrigin(this.SIGN_CONFIG.rect.originX, this.SIGN_CONFIG.rect.originY);

        this.setInteractive(signRect);
        signRect.on('pointerdown', () => {
            this.dialogManager.setNode(signNode);
        });
    }
}