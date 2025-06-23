import { moveTowards } from "../framework/utils/misc.js";

export default class Character extends Phaser.GameObjects.Sprite {
    /**
    * Personaje del juego
    * @param {Phaser.scene} scene - escena donde se anade el personaje 
    * @param {number} x - posicion inicial en X
    * @param {number} y - posicion inicial en Y
    * @param {number} scale - escala del sprite
    * @param {number} name - nombre del personaje
    * @param {number} speed - velocidad de movimiento
    * @param {function} callback - funcion a ejecutar al hacer click sobre el personaje
    * @param {boolean} lookingRight - indica si el personaje inicialmente mira hacia la derecha (true) o no (false)
    */
    constructor(scene, x, y, scale, name, speed, callback, lookingRight = false) {
        super(scene, x, y, name)

        this.scene = scene;
        this.scene.add.existing(this);

        this.setScale(scale);
        this.name = name;
        this.speed = speed;
        this.target = null;
        this.callback = callback;
        this.lookingRight = lookingRight;

        let getAnimationKey = (type) => {
            return this.name + type;
        }

        // Tipos de animaciones que el personaje puede reproducir
        this.types = {
            idle: getAnimationKey("Idle"),
            sitting: getAnimationKey("Sitting"),
            talking: getAnimationKey("Talking"),
            walking: getAnimationKey("Walking")
        }

        this.scene.setInteractive(this);
        this.on("pointerdown", () => {
            if (this.callback) {
                this.callback();
            }
        });

        // Se reproduce la animacion por defecto cuando termina una dialogo
        this.scene.dispatcher.add("endNodes", this, () => {
            this.playDefaultAnimation();
        });

        // Se reproduce la animacion por defecto cuando comienza un nodo de eleccion
        this.scene.dispatcher.add("startChoiceNode", this, (node) => {
            this.playDefaultAnimation();
        });

        // Cuando comienza un nodo de texto, se comprueba que personaje esta activo para comenzar la animacion:
        // - Si no es este personaje y esta hablando, se vuelve a la animacion por defecto
        // - Si es este personaje, intenta reproducir la animacion de hablar
        this.scene.dispatcher.add("startTextNode", this, (node) => {
            if (this.name != node.character &&
                this.anims.isPlaying &&
                this.anims.currentAnim.key == this.types.talking) {
                this.playDefaultAnimation();
            }
            else if (this.name == node.character) {
                if (!this.playTalkingAnimation()) {
                    this.playDefaultAnimation();
                }
            }
        });
    }

    preUpdate(time, deltaTime) {
        super.preUpdate(time, deltaTime);

        if (this.target !== null) {
            let step = this.speed * deltaTime;

            // Calcula la nueva posicion moviendo hacia target con limite step
            let newPos = moveTowards(this, this.target, step);

            this.x = newPos.x;
            this.y = newPos.y;

            let dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
            // Si esta suficientemente cerca del target, se para el movimiento
            if (dist < 0.1) {
                this.x = this.target.x;
                this.y = this.target.y;
                this.target = null;
                this.scene.setInteractive(this);
                this.stopAnimation();
                this.emit("targetReached");
            }
        }
    }

    /**
    * Reproduce la animacion del tipo dado si existe
    * @param {string} type - tipo de animacion (idle, walking...)
    * @returns {boolean} - true si la animacion existe o si se esta reproduciendo
    */
    playAnimation(type) {
        if (this.scene.anims.exists(type)) {
            if (!this.anims.isPlaying || this.anims.currentAnim.key != type) {
                this.play(type)
            }
            return true;
        }
        return false;
    }

    /**
    * Reproduce la animacion por defecto (idle o sitting)
    * @returns {boolean} - true si alguna de las dos animaciones se reproduce correctamente
    */
    playDefaultAnimation() {
        let play = this.playAnimation(this.types.idle)
        if (!play) {
            play = this.playAnimation(this.types.sitting);
        }
        return play;
    }

    playTalkingAnimation() {
        return this.playAnimation(this.types.talking);
    }

    playWalkingAnimation() {
        return this.playAnimation(this.types.walking);
    }

    stopAnimation() {
        this.stop();
    }

    /**
    * Si no se esta moviendo actualmente, inicia el movimiento hacia target
    * @param {Object} target - punto destino con propiedades {x, y}
    */
    moveTowards(target) {
        if (this.target === null && target.hasOwnProperty("x") && target.hasOwnProperty("y")) {
            this.disableInteractive();
            this.playWalkingAnimation();
            this.target = target;

            if (this.target.x > this.x && !this.lookingRight) {
                this.flipX = true;
            }
            else if (this.target.x <= this.x && this.lookingRight) {
                this.flipX = false;
            }
        }
    }

    destroy() {
        this.scene.dispatcher.removeByOwner(this);
        super.destroy();
    }
}