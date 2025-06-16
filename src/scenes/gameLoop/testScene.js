import BaseScene from "./baseScene.js";


export default class TestScene extends BaseScene {
    /**
    * Escena inicial en la que se cargan todos los recursos
    * @extends Phaser.Scene
    */
    constructor() {
        super("TestScene", "TestScene");
    }

    create() {
        super.create();

        let img = this.add.image(0, 0, "mainMenu").setOrigin(0, 0);

        img.setInteractive();
        img.on("pointerdown", () => {
            let video = this.add.video(0, 0, "startAnimation").setOrigin(0, 0);
            video.play();

            video.on("created", () => {
                this.CANVAS_WIDTH = this.sys.game.canvas.width;
                this.CANVAS_HEIGHT = this.sys.game.canvas.height;

                // console.log(video.width)
                let scaleX = this.CANVAS_WIDTH / video.width;
                let scaleY = this.CANVAS_HEIGHT / video.height;
                let scale = Math.max(scaleX, scaleY);

                video.setScale(scale);

                video.on("complete", () => {
                    video.destroy();
                })
            });
        })

        let nodes = this.cache.json.get("house");
        let lol = this.dialogManager.readNodes(this, nodes, "scenes\\house", "search");
        // let nodes = this.cache.json.get("test");
        // let lol = this.dialogManager.readNodes(this, nodes, "scenes\\test")
        this.dialogManager.setNode(lol);

        let errors = 0;
        this.dispatcher.add("wrongAnswer", this, () => {
            errors++;
            this.blackboard.setValue("errors", errors);
        });
    }
}