import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";

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

        let nodes = this.cache.json.get("corridor");
        let dialogsNamespace = "scenes\\corridor";

        let locationNode = this.dialogManager.readNodes(this, nodes, dialogsNamespace, "locationInquiry");

        let textAreaConfig = {
            x: 575,
            width: 325,
            height: 90,
            originX: 1,
            originY: 0.5
        };

        let rectConfig = {
            x: 393,
            width: 410,
            height: 105,
            originX: 0.5,
            originY: 0.5
        }

        let signTextConfig = { ...this.signTextConfig };
        signTextConfig.align = 'right';

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
            let textArea = super.createTextArea(textAreaConfig.x, y, textAreaConfig.width, textAreaConfig.height,
                textAreaConfig.originX, textAreaConfig.originY, this.localizationManager.translate(id, "scenes"), signTextConfig);

            let rect = this.add.zone(rectConfig.x, y, rectConfig.width, rectConfig.height);
            rect.setOrigin(rectConfig.originX, rectConfig.originY);
            this.setInteractive(rect);

            let signNode = this.dialogManager.readNodes(this, nodes, dialogsNamespace, id);
            rect.on('pointerdown', () => {
                this.dialogManager.setNode(signNode);
            });
        });

        // Luis
        let exitPoint = {
            x: -100,
            y: 650
        };
        let luisChar = new Character(this, 1200, exitPoint.y, 1.5, "Luis", this.characterConfig.speed, false, null);
        luisChar.setOrigin(0.5, 0.5);
        this.dispatcher.addOnce("leaveRoom", this, () => {
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
}