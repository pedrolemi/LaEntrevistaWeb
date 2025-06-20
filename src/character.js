import { moveTowards, getInteractiveConfig } from "./utils/misc.js";

export default class Character extends Phaser.GameObjects.Sprite {
    /**
     * Personaje del juego
     * @param {Phaser.scene} scene - Escena donde se anade el personaje 
     * @param {number} x - posicion inicial en X
     * @param {number} y - posicion inicial en Y
     * @param {number} scale - escala del sprite
     * @param {number} name - nombre del personaje
     * @param {number} speed - velocdiad de movimiento
     * @param {function} callback - funcion a ejecutar al hacer click sobre el personaje
     */
    constructor(scene, x, y, scale, name, speed, callback) {
        super(scene, x, y, name)

        this.scene = scene;
        this.scene.add.existing(this);

        // Tipos de animaciones que puede reproducir el personaje
        this.types = {
            idle: "Idle",
            sitting: "Sitting",
            talking: "Talking",
            walking: "Walking"
        }

        this.setScale(scale);
        this.name = name;
        this.speed = speed;
        this.target = null;
        this.callback = callback;

        this.setInteractive();
        this.on("pointerdown", () => {
            if (this.callback) {
                this.callback();
            }
        });
    }

    setInteractive() {
        super.setInteractive(getInteractiveConfig(this, {}));
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
                this.setInteractive();
                this.stopAnimation();
            }
        }
    }

    /**
    * Construye la clave de animaciones para un tipo (ejemplo: CharacterNameIdle)
    * @param {string} type - tipo de animacion (idle, walking...)
    * @returns {string} - clave de la animacion completa
    */
    getAnimationKey(type) {
        return this.name + type;
    }

    /**
    * Reproduce la animacion del tipo dado si existe
    * @param {string} type - tipo de animacion (idle, walking...)
    * @returns {boolean} - true si la animacion existe o si se esta reproduciendo
    */
    playAnimation(type) {
        let key = this.getAnimationKey(type)

        if (this.scene.anims.exists(key)) {
            if (!this.anims.isPlaying || this.anims.currentAnim.key != key) {
                this.play(key)
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
        }
    }
}