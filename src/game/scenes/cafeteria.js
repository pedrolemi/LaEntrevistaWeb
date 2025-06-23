import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";

export default class Cafeteria extends LaEntrevistaBaseScene {
    /**
    * Escena de la casa
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("Cafeteria", "Cafeteria");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "cafeteria").setOrigin(0, 0);

        this.nodes = this.cache.json.get("cafeteria");
        let namespace = "scenes\\cafeteria";

        let menNode = this.dialogManager.readNodes(this, this.nodes, namespace, "menConversation");

        let exitPoint = {
            x: 1700,
            y: 1000
        };

        // Pedro
        let pedroChar = new Character(this, 1382, 504, 0.66, "Pedro", this.characterConfig.speed, false, () => {
            this.dialogManager.setNode(menNode);
        });
        pedroChar.setOrigin(0.5, 0.5);
        pedroChar.playDefaultAnimation();

        this.add.sprite(0, 0, "tableTop").setOrigin(0, 0);
        this.add.sprite(0, 0, "tableLegs").setOrigin(0, 0);
        // Jesus
        let jesusChar = new Character(this, 1032, 506, 0.62, "Jesus", this.characterConfig.speed, true, () => {
            this.dialogManager.setNode(menNode);
        });

        jesusChar.setOrigin(0.5, 0.5);
        jesusChar.playDefaultAnimation();

        this.dispatcher.addOnce("menExit", this, () => {
            this.leaveRoom([jesusChar, pedroChar], exitPoint);
        })

        let womenNode = this.dialogManager.readNodes(this, this.nodes, namespace, "womenConversation");
        let trioNode = this.dialogManager.readNodes(this, this.nodes, namespace, "trioConversation");

        let monicaChar = new Character(this, 265, 640, 0.87, "Monica", this.characterConfig.speed, true, () => {
            this.dialogManager.setNode(womenNode);
        });
        monicaChar.setOrigin(0.5, 0.5);

        let rebecaChar = new Character(this, 440, 620, 0.9, "Rebeca", this.characterConfig.speed, false, () => {
            this.dialogManager.setNode(womenNode);
        });
        rebecaChar.setOrigin(0.5, 0.5);

        let trioPoint = {
            x: 640,
            y: 610
        }
        let carlosChar = new Character(this, exitPoint.x, exitPoint.y, 0.96, "Carlos", this.characterConfig.speed, false, null);
        carlosChar.setOrigin(0.5, 0.5);
        this.dispatcher.addOnce("trioExit", this, () => {
            this.leaveRoom([monicaChar, rebecaChar, carlosChar], exitPoint);
        })

        let manArrive = false;
        let continueConversation = () => {
            let value = "womenConversationEnded";
            if (manArrive && this.blackboard.hasValue(value) && this.blackboard.getValue(value)) {
                this.dialogManager.clearNodes();
                this.dialogManager.setNode(trioNode);
            }
        }

        this.dispatcher.addOnce("manArrive", this, () => {
            carlosChar.moveTowards(trioPoint);
            carlosChar.once("targetReached", () => {
                manArrive = true;
                continueConversation();
            })
        });

        this.dispatcher.addOnce("womenConversationEnded", this, () => {
            continueConversation();
        });
    }
}