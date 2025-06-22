import { setInteractive } from "../utils/misc.js";

export default class InteractiveContainer extends Phaser.GameObjects.Container {
    /**
    * Clase base para los elementos de dialogo, con metodos para activar/desactivar el objeto y calcular su rectangulo de colision
    * @extends Phaser.GameObjects.Container
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {*} scene 
    * @param {*} x 
    * @param {*} y 
    */
    constructor(scene, x = 0, y = 0) {
        super(scene, x, y);
        this.scene = scene;

        // Configuracion de las animaciones
        this.animConfig = {
            fadeTime: 150,
            fadeEase: "linear"
        }
        this.fadeAnim = null;

        scene.add.existing(this);

        this.CANVAS_WIDTH = scene.sys.game.canvas.width
        this.CANVAS_HEIGHT = scene.sys.game.canvas.height;
    }

    /**
    * Activa o desactiva los objetos indicados
    * @param {Boolean} active - si se va a activar el objeto
    * @param {Function} onComplete - funcion a la que llamar cuando acabe la animacion (opcional)
    * @param {Number} delay - tiempo en ms que tarda en llamarse a onComplete (opcional)
    */
    activate(active, onComplete = {}, delay = 0) {
        let initAlpha = 0;
        let endAlpha = 1;
        let duration = this.animConfig.fadeTime

        if (!active) {
            initAlpha = 1;
            endAlpha = 0;
            this.disableInteractive();
        }

        if (!active && !this.visible) {
            initAlpha = 0;
            endAlpha = 0;
            duration = 0;
        }
        else if (active && this.visible) {
            initAlpha = 1;
            endAlpha = 1;
            duration = 0;
        }

        this.setVisible(true);

        // Fuerza la opacidad a la inicial
        this.setAlpha(initAlpha);

        // Hace la animacion
        this.fadeAnim = this.scene.tweens.add({
            targets: this,
            alpha: { from: initAlpha, to: endAlpha },
            ease: this.animConfig.fadeEase,
            duration: duration,
            repeat: 0,
        });

        // Al terminar la animacion, se ejecuta el onComplete si es una funcion valida
        this.fadeAnim.on("complete", () => {
            if (active) {
                this.setInteractive();
            }
            else {
                this.setVisible(false);
            }

            if (onComplete != null && typeof onComplete == "function") {
                setTimeout(() => {
                    onComplete();
                }, delay);
            }
        });
    }


    /**
    * Obtiene las dimensiones del rectangulo del container para hacerlo interactivo
    * @param {Boolean} debug - true para dibujar el area del rectangulo, false en caso contrario (opcional)
    * @param {String} objectName - nombre del objeto a imprimir en el debug (opcional)
    */
    calculateRectangleSize(debug = false, objectName = "") {
        let dims = this.getBounds();
        this.setSize(dims.width, dims.height);

        let rectangle = new Phaser.Geom.Rectangle(dims.x + dims.width / 2, dims.y + dims.height / 2, dims.width, dims.height);

        let interactiveConfig = {
            hitArea: rectangle,
            hitAreaCallback: Phaser.Geom.Rectangle.Contains
        }
        setInteractive(this, interactiveConfig);

        if (debug) {
            this.add(this.scene.add.rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height, 0x000, 0.4));
            this.on("pointerdown", () => {
                console.log("clicking",objectName);
            });
        }
        this.disableInteractive();
    }
}