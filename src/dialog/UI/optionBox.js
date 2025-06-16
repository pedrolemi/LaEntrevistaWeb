import DialogObject from "./dialogObject.js";
import { completeMissingProperties } from "../../utils/misc.js"
import { DEFAULT_TEXT_CONFIG } from "../../utils/graphics.js"

export default class OptionBox extends DialogObject {
   /**
    * Caja de texto para los dialogos
    * @extends DialogObject
    * @param {Phaser.Scene} scene - escena en la que se crea (idealmente la escena de UI)
    * @param {Number} index - indice de la opcion de entre todas las opciones
    * @param {Number} totalOpts - numero total de opciones
    * @param {String} text - texto a mostrar en la opcion
    * @param {Function} onClick - funcion a ejecutar al pulsar la opcion (opcional)
    * @param {Boolean} debug - true para mostrar la caja de colision, false en caso contrario (opcional)
    * @param {Object} boxConfig - configuracion de la caja de opcion (opcional)
    * @param {Object} textConfig - configuracion del texto de la caja (opcional)
    */
    constructor(scene, index, totalOpts, text, onClick = {}, debug = false, boxConfig = {}, textConfig = {}) {
        super(scene);

        let DEFAULT_BOX_CONFIG = {
            imgX: this.CANVAS_WIDTH / 2,
            img: "optionBox",
            imgOriginX: 0.5,
            imgOriginY: 0.5,
            scaleX: 1,
            scaleY: 1,

            boxSpacing: 3,

            marginX: 70,
            marginY: 42,
            textOriginX: 0,
            textOriginY: 0.5,

            noTintColor: "#ffffff",
            pointerOverColor: "#d9d9d9"
        }

        // Completar los parametros faltantes de los argumentos
        this.boxConfig = completeMissingProperties(boxConfig, DEFAULT_BOX_CONFIG);
        this.textConfig = completeMissingProperties(textConfig, DEFAULT_TEXT_CONFIG);

        // Crear la imagen de la caja de opciones
        this.box = scene.add.image(this.boxConfig.imgX, 0, this.boxConfig.img)
            .setOrigin(this.boxConfig.imgOriginX, this.boxConfig.imgOriginY).setScale(this.boxConfig.scaleX, this.boxConfig.scaleY);

        // Calcular la posicion de la caja
        this.box.y = this.CANVAS_HEIGHT - (this.box.displayHeight * this.boxConfig.imgOriginY) - this.box.displayHeight * (totalOpts - index - 1) - this.boxConfig.boxSpacing;

        // Calcular la posicion del texto
        let textX = this.box.x - (this.box.displayWidth * this.boxConfig.imgOriginX) + this.boxConfig.marginX;
        let textY = this.box.y - (this.box.displayHeight * this.boxConfig.imgOriginY) + this.boxConfig.marginY;

        // Crear el texto
        this.textObj = scene.add.text(textX, textY, text, this.textConfig)
            .setOrigin(this.boxConfig.textOriginX, this.boxConfig.textOriginY).setScale(this.boxConfig.scaleX, this.boxConfig.scaleY);

        
        // Anadir los elementos al container
        this.add(this.box);
        this.add(this.textObj);

        this.calculateRectangleSize(debug, "dialogBox");
        this.addAnimations(onClick);

        this.visible = false;
    }

    addAnimations(onClick) {
        // Configuracion de las animaciones
        let tintFadeTime = 50;

        let noTint = Phaser.Display.Color.HexStringToColor(this.boxConfig.noTintColor);
        let pointerOverColor = Phaser.Display.Color.HexStringToColor(this.boxConfig.pointerOverColor);

        // Hace fade del color de la caja al pasar o quitar el raton por encima
        this.on('pointerover', () => {
            this.scene.tweens.addCounter({
                targets: this,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(noTint, pointerOverColor, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.box.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });
        this.on('pointerout', () => {
            this.scene.tweens.addCounter({
                targets: this,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pointerOverColor, noTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.box.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
            });
        });

        // Al hacer click, vuelve a cambiar el color de la caja al original y llama al onclick al terminar la animacion
        this.on('pointerdown', () => {
            this.box.disableInteractive();
            let fadeColor = this.scene.tweens.addCounter({
                targets: this,
                from: 0,
                to: 100,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    let col = Phaser.Display.Color.Interpolate.ColorWithColor(pointerOverColor, noTint, 100, value);
                    let colInt = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
                    this.box.setTint(colInt);
                },
                duration: tintFadeTime,
                repeat: 0,
                yoyo: true
            });
            fadeColor.on('complete', () => {
                if (onClick != null && typeof onClick == "function") {
                    onClick();
                }
            });
        });
    }
}