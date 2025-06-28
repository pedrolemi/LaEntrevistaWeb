import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";

export default class waitingRoom extends LaEntrevistaBaseScene {
    /**
    * Escena de la sala de espera
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("WaitingRoom");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "waitingRoom").setOrigin(0, 0);
        let nodes = this.cache.json.get("waitingRoom");
        let namespace = "scenes\\waitingRoom";

        let arrowScale = 0.5;
        let corridorArrow = this.add.image(100, 540, "sideArrow").setOrigin(0.5, 0.5).setScale(arrowScale).setAngle(-90);
        let doorArrow = this.add.image(1100, 660, "frontArrow").setOrigin(0.5, 0.5).setScale(arrowScale);
        doorArrow.setVisible(false);
        this.tweens.add({
            targets: [corridorArrow, doorArrow],
            scale: { from: arrowScale, to: arrowScale * 1.2 },
            duration: 1000,
            repeat: -1,
            yoyo: true
        });


        let corridor = this.add.rectangle(0, 0, 160, this.CANVAS_HEIGHT, 0x000, 0).setOrigin(0, 0);
        this.setInteractive(corridor);
        corridor.on("pointerdown", () => {
            this.gameManager.startCorridorScene();
        });

        // Puerta
        let doorNode = this.dialogManager.readNodes(this, nodes, namespace, "door");

        let door = this.add.rectangle(1097, 430, 140, 470, 0x000, 0).setOrigin(0.5, 0.5);
        this.setInteractive(door);
        door.on("pointerdown", () => {
            if (this.gameManager.hasMetInteractionRequirement()) {
                let anim = this.tweens.add({
                    targets: [corridorArrow, doorArrow],
                    alpha: { from: 1, to: 0 },
                    duration: 200,
                    repeat: 0
                });
                anim.on("complete", () => {
                    corridorArrow.setVisible(false);
                    doorArrow.setVisible(false);
                });
                this.gameManager.startOfficeScene();
            }
            else {
                this.dialogManager.setNode(doorNode);
            }
        });

        let textArea = super.createTextArea(1227, 280, 95, 60, 0.5, 0.5,
            this.localizationManager.translate("humanResourcesSign", "scenes"), this.signTextConfig);

        // Jaime
        let jaimeExitPoint = {
            x: -100,
            y: 740
        }

        let jaimeNode = this.dialogManager.readNodes(this, nodes, namespace, "JaimeConversation");
        let jaimeConfig = {
            x: 442,
            scale: 0.9
        }
        let jaimeChar = new Character(this, jaimeConfig.x, jaimeExitPoint.y, jaimeConfig.scale, "Jaime",
            this.characterConfig.speed, true, () => {
                this.dialogManager.setNode(jaimeNode);
            });
        jaimeChar.setOrigin(0.5, 1);

        this.dispatcher.addOnce("JaimeLeave", this, () => {
            jaimeChar.setScale(jaimeChar.scale * 0.80);
            this.leaveRoom([jaimeChar], jaimeExitPoint);
        })

        // Antonio
        let antonioExitPoint = {
            x: -100,
            y: 550
        }

        let antonioNode = this.dialogManager.readNodes(this, nodes, namespace, "AntonioConversation");
        let antonioConfig = {
            x: 730,
            scale: 0.8
        }
        let antonioChar = new Character(this, antonioConfig.x, antonioExitPoint.y, antonioConfig.scale, "Antonio",
            this.characterConfig.speed, false, () => {
                this.dialogManager.setNode(antonioNode);
            });
        antonioChar.setOrigin(0.5, 0.5);

        this.dispatcher.addOnce("AntonioLeave", this, () => {
            antonioChar.setScale(antonioChar.scale * 0.68);
            this.leaveRoom([antonioChar], antonioExitPoint);
        })
    }
}