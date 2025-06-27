import LaEntrevistaBaseScene from "../laEntrevistaBaseScene.js";

export default class MainMenu extends LaEntrevistaBaseScene {
    /**
    * Menu principal
    * @extends BaseScene
    */
    constructor() {
        super("MainMenu");
    }

    create() {
        super.create();

        let img = this.add.image(0, 0, "mainMenu").setOrigin(0, 0);
        let video = this.add.video(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2, "startAnimation");
        video.setVisible(false);

        // TODO: Cambiar por imagen del boton
        this.setInteractive(img);
        img.on("pointerdown", () => {
            img.disableInteractive();
            video.setVisible(true);
            video.play();
        })

        video.on("created", () => {
            // console.log(video.width)
            let scaleX = this.CANVAS_WIDTH / video.width;
            let scaleY = this.CANVAS_HEIGHT / video.height;
            let scale = Math.max(scaleX, scaleY);

            video.setScale(scale * 1.15);
            video.setPlaybackRate(3);
        });
        video.on("complete", () => {
            this.gameManager.startGame();
            video.destroy();
        });

    }
}