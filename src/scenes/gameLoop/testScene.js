import SceneManager from "../../managers/sceneManager.js";

export default class TestScene extends Phaser.Scene {
    /**
    * Escena inicial en la que se cargan todos los recursos
    * @extends Phaser.Scene
    */
    constructor() {
        super({key: "TestScene"});
    }

    preload() {
        this.load.video("anim", "assets/computer/animacioncreditos.mp4", true);
    }

    create() {
        const CANVAS_WIDTH = this.sys.game.canvas.width;
        const CANVAS_HEIGHT = this.sys.game.canvas.height;

        let video = this.add.video(0, 0, "anim").setOrigin(0, 0);
        video.play();

        video.on('created', function(video, width, height) {
            console.log(width, height)
            let scale = CANVAS_WIDTH / width;
            video.setScale(scale);
        });

        video.on("complete", () => {console.log("asdsa")})
    }
}