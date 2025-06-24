import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";

export default class Cafeteria extends LaEntrevistaBaseScene {
    /**
    * Escena de la casa
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("Cafeteria");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "cafeteria").setOrigin(0, 0);

        let nodes = this.cache.json.get("cafeteria");
        let namespace = "scenes\\cafeteria";

        let menNode = this.dialogManager.readNodes(this, nodes, namespace, "menConversation");

        let exitPoint = {
            x: 1700,
            y: 1000
        };

        // Pedro
        let pedroConfig = {
            x: 1382,
            y: 504,
            scale: 0.66
        };
        let pedroChar = new Character(this, pedroConfig.x, pedroConfig.y, pedroConfig.scale, "Pedro", this.characterConfig.speed, false, () => {
            this.dialogManager.setNode(menNode);
        });
        pedroChar.setOrigin(this.characterConfig.originX, this.characterConfig.originY);

        this.add.sprite(0, 0, "tableTop").setOrigin(0, 0);
        this.add.sprite(0, 0, "tableLegs").setOrigin(0, 0);

        // Jesus
        let jesusConfig = {
            x: 1032,
            y: 506,
            scale: 0.62
        }
        let jesusChar = new Character(this, jesusConfig.x, jesusConfig.y, jesusConfig.scale, "Jesus", this.characterConfig.speed, true, () => {
            this.dialogManager.setNode(menNode);
        });

        jesusChar.setOrigin(this.characterConfig.originX, this.characterConfig.originY);

        this.dispatcher.addOnce("menExit", this, () => {
            this.leaveRoom([jesusChar, pedroChar], exitPoint);
        })

        let womenNode = this.dialogManager.readNodes(this, nodes, namespace, "womenConversation");
        let trioNode = this.dialogManager.readNodes(this, nodes, namespace, "trioConversation");

        // Monica
        let monicaConfig = {
            x: 265,
            y: 640,
            scale: 0.87
        }
        let monicaChar = new Character(this, monicaConfig.x, monicaConfig.y, monicaConfig.scale, "Monica", this.characterConfig.speed, true, () => {
            this.dialogManager.setNode(womenNode);
        });
        monicaChar.setOrigin(this.characterConfig.originX, this.characterConfig.originY);

        // Rebeca
        let rebecaConfig = {
            x: 440,
            y: 620,
            scale: 0.9
        }
        let rebecaChar = new Character(this, rebecaConfig.x, rebecaConfig.y, rebecaConfig.scale, "Rebeca", this.characterConfig.speed, false, () => {
            this.dialogManager.setNode(womenNode);
        });
        rebecaChar.setOrigin(0.5, 0.5);

        // Carlos
        let carlosConfig = {
            target: {
                x: 640,
                y: 610
            },
            scale: 0.96
        }
        let carlosChar = new Character(this, exitPoint.x, exitPoint.y, carlosConfig.scale, "Carlos", this.characterConfig.speed, false, null);
        carlosChar.setOrigin(this.characterConfig.originX, this.characterConfig.originY);
        this.dispatcher.addOnce("trioExit", this, () => {
            this.leaveRoom([monicaChar, rebecaChar, carlosChar], exitPoint);
        })

        // Gestionar el fin de la conversacion entre Monica y Rebeca y la llegada de Carlos, 
        // para comenzar la conversacion entre los tres
        let manArrive = false;
        let continueConversation = () => {
            let value = "womenConversationEnded";
            if (manArrive && this.blackboard.has(value) && this.blackboard.get(value)) {
                this.dialogManager.clearNodes();
                this.dialogManager.setNode(trioNode);
            }
        }

        this.dispatcher.addOnce("manArrive", this, () => {
            carlosChar.moveTowards(carlosConfig.target);
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