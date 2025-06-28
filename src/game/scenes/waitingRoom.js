import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";
import Character from "../character.js";

export default class waitingRoom extends LaEntrevistaBaseScene {
    /**
    * Escena del pasillo
    * @extends LaEntrevistaBaseScene
    */
    constructor() {
        super("WaitingRoom");
    }

    create() {
        super.create();

        let bg = this.add.image(0, 0, "waitingRoom").setOrigin(0, 0);

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

        // TODO: Hacer todo lo posterior a esto cuando se hable con todos los personajes
        doorArrow.setVisible(true);
        this.tweens.add({
            targets: doorArrow,
            alpha: { from: 0, to: 1 },
            duration: 200,
            repeat: 0
        });
        
        let door = this.add.rectangle(1097, 430, 140, 470, 0x000, 0).setOrigin(0.5, 0.5);
        this.setInteractive(door);
        door.on("pointerdown", () => {
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
        });

        
    }
}