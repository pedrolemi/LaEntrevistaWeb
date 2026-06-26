import DefaultEventNames from "../../framework/utils/eventNames.js";

export default class Character extends Phaser.GameObjects.PathFollower {
    /**
    * Personaje del juego
    * @param {Phaser.scene} scene - escena donde se anade el personaje 
    * @param {number} x - posicion inicial en X
    * @param {number} y - posicion inicial en Y
    * @param {number} scale - escala del sprite
    * @param {number} name - nombre del personaje
    * @param {number} speed - velocidad de movimiento
    * @param {boolean} facingRight - indica si el personaje inicialmente mira hacia la derecha (true) o no (false)
    * @param {function} onClick - funcion a ejecutar al hacer click sobre el personaje
    */
    constructor(scene, x, y, scale, name, speed, facingRight, onClick) {
        super(scene, new Phaser.Curves.Path(x, y), x, y, name)

        this.scene = scene;
        this.scene.add.existing(this);

        this.originalScale = scale;
        this.setScale(scale);
        this.name = name;
        this.speed = speed;
        this.facingRight = facingRight;
        this.onClick = onClick;
        this.dialogAnimationEnabled = true;

        let getAnimationKey = (type) => {
            return this.name + type;
        }

        // Tipos de animaciones que el personaje puede reproducir
        this.types = {
            idle: getAnimationKey("Idle"),
            sitting: getAnimationKey("Sitting"),
            talking: getAnimationKey("Talking"),
            walking: getAnimationKey("Walking"),
            pointing: getAnimationKey("Pointing")
        }

        if (this.onClick != null && typeof this.onClick == "function") {
            this.scene.setInteractive(this);

            this.on("pointerdown", () => {
                // TRACKER EVENT
                this.scene.trackerManager.sendInteractGameObject(`${this.scene.scene.key}_${this.name}`, true);

                this.onClick();
            });
        }

        // Se reproduce la animacion por defecto cuando termina una dialogo
        this.scene.dispatcher.add(DefaultEventNames.endDialogNodes, this, () => {
            if (this.dialogAnimationEnabled) {
                this.playDefaultAnimation();
            }
        });

        // Se reproduce la animacion por defecto cuando comienza un nodo de eleccion
        this.scene.dispatcher.add(DefaultEventNames.startChoiceNode, this, (node) => {
            if (this.dialogAnimationEnabled) {
                this.playDefaultAnimation();
            }
        });

        // Cuando comienza un nodo de texto, se comprueba que personaje esta activo para comenzar la animacion:
        // - Si no es este personaje y esta hablando, se vuelve a la animacion por defecto
        // - Si es este personaje, intenta reproducir la animacion de hablar
        this.scene.dispatcher.add(DefaultEventNames.startTextNode, this, (node) => {
            if (this.dialogAnimationEnabled) {
                if (this.name != node.character && this.anims.isPlaying && this.anims.currentAnim.key == this.types.talking) {
                    this.playDefaultAnimation();
                }
                else if (this.name == node.character) {
                    if (!this.playTalkingAnimation()) {
                        this.playDefaultAnimation();
                    }
                }
            }
        });

        this.playDefaultAnimation();

        this.on("destroy", () => {
            this.removeEvents();
        });
    }

    /**
    * Reproduce la animacion del tipo dado si existe
    * @param {string} type - tipo de animacion (idle, walking...)
    * @param {object} config - configuración adicional para la animación
    * @returns {boolean} - true si la animacion existe o si se esta reproduciendo
    */
    playAnimation(type, config = {}) {
        if (this.scene.anims.exists(type)) {
            if (!this.anims.isPlaying || this.anims.currentAnim.key != type) {
                config.key = type;
                this.play(config)
            }
            return true;
        }
        return false;
    }

    /**
    * Reproduce la animacion por defecto (idle o sitting)
    * @param {object} config - configuración adicional para la animación
    * @returns {boolean} - true si alguna de las dos animaciones se reproduce correctamente
    */
    playDefaultAnimation(config = {}) {
        let play = this.playAnimation(this.types.idle, config)
        if (!play) {
            play = this.playAnimation(this.types.sitting, config);
        }
        return play;
    }

    playTalkingAnimation(config = {}) {
        return this.playAnimation(this.types.talking, config);
    }

    playWalkingAnimation(config = {}) {
        return this.playAnimation(this.types.walking, config);
    }

    setFacingDirection(right) {
        this.flipX = this.facingRight !== right;
    }

    /**
    * Si no se esta moviendo actualmente, inicia el movimiento hacia target
    * @param {Phaser.Math.Vector2} target - punto destino
    * @param {number} scaleFactor - factor para disminuir o aumentar la escala durante el movimiento (opcional)
    */
    moveTowards(target, scaleIncrease = 1) {
        this.path.lineTo(target.x, target.y);
        let pathLength = this.path.getLength();
        let duration = pathLength / this.speed;

        if (target.x > this.x) {
            this.setFacingDirection(true);
        }
        else if (target.x <= this.x) {
            this.setFacingDirection(false);
        }

        this.disableInteractive();
        this.playWalkingAnimation();
        this.setDialogAnimations(false);

        this.startFollow({
            duration: duration,
            repeat: 0
        });

        if (scaleIncrease !== 1) {
            let scaleTween = this.scene.tweens.add({
                targets: this,
                scale: this.originalScale * scaleIncrease,
                duration: duration,
                repeat: 0,
            });

            scaleTween.on("complete", () => {
                this.setScale(this.originalScale);
            })
        }

        this.pathTween.on("complete", () => {
            if (!this.isFollowing()) {
                this.scene.setInteractive(this);
                this.playDefaultAnimation();
                this.setDialogAnimations(true);

                this.path = new Phaser.Curves.Path(this.x, this.y);

                this.emit("targetReached");
            }
        })
    }

    removeEvents() {
        this.scene.dispatcher.removeByObject(this);
    }

    setDialogAnimations(enable) {
        this.dialogAnimationEnabled = enable;
    }
}