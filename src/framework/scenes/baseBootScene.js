export default class BaseBootScene extends Phaser.Scene {
    /**
    * Clase base para la escena inicial en la que se cargan los recursos que se usan en PreloaderScene
    * @extends Phaser.Scene
    */

    constructor(key = "BootScene") {
        super({ key: key });
    }

    /**
    * Aqui se deben cargar SOLO los assets para la PANTALLA DE CARGA
    */
    preload() { }

    create() {
        this.scene.start("PreloaderScene");
    }
}