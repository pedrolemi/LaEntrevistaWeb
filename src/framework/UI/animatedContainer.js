export default class AnimatedContainer extends Phaser.GameObjects.Container {
    /**
    * Clase que extiende Container para agregar controles de visibilidad con animaciones
    * @extends Phaser.GameObjects.Container
    * @param {Phaser.Scene} scene - escena a la que pertenece
    * @param {Number} x - posicion x (opcional)
    * @param {Number} y - posicion y (opcional)
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
    * Metodo base para activar o desactiar los objetos con una animacion de opacidad
    * @param {Boolean} active - si se va a activar el objeto
    * @param {Function} onComplete - funcion a la que llamar cuando acaba la animacion
    */
    baseActivate(active, onComplete) {
        let initAlpha = 0;
        let endAlpha = 1;
        let duration = this.animConfig.fadeTime

        if (!active) {
            initAlpha = 1;
            endAlpha = 0;
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
            if (onComplete != null && typeof onComplete == "function") {
                onComplete();
            }
        });
    }

    /**
    * Activa o desactiva los objetos indicados
    * @param {Boolean} active - si se va a activar el objeto
    * @param {Function} onComplete - funcion a la que llamar cuando acaba la animacion (opcional)
    * @param {Number} delay - tiempo en ms que tarda en llamarse a onComplete (opcional)
    */
    activate(active, onComplete = null, delay = 0) {
        this.baseActivate(active, () => {
            if (!active) {
                this.setVisible(false);
            }

            if (onComplete != null && typeof onComplete == "function") {
                setTimeout(() => {
                    onComplete();
                }, delay);
            }
        });
    }
}