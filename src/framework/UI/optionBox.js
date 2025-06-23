import InteractiveContainer from "./interactiveContainer.js";
import { completeMissingProperties } from "../utils/misc.js"
import { DEFAULT_TEXT_CONFIG } from "../utils/graphics.js"
import TextArea from "./textArea.js";

export default class OptionBox extends InteractiveContainer {
    /**
    * Caja de texto para los dialogos
    * @extends InteractiveContainer
    * @param {Phaser.Scene} scene - escena en la que se crea (idealmente la escena de UI)
    * @param {Number} index - indice de la opcion de entre todas las opciones
    * @param {Number} totalOpts - numero total de opciones
    * @param {String} text - texto a mostrar en la opcion
    * @param {Function} onClick - funcion a ejecutar al pulsar la opcion (opcional)
    * @param {Object} boxConfig - configuracion de la caja de opcion (opcional)
    * @param {Object} textConfig - configuracion del texto de la caja (opcional)
    */
    constructor(scene, index, totalOpts, text, onClick = {}, boxConfig = {}, textConfig = {}) {
        super(scene);
        let debug = false;

        let DEFAULT_BOX_CONFIG = {
            collectiveAlignY: 1,
            collectiveTopMargin: 0,

            imgX: this.CANVAS_WIDTH / 2,
            img: "optionBox",
            imgOriginX: 0.5,
            imgOriginY: 0.5,
            imgAlpha: 1,

            scaleX: 1,
            scaleY: 1,

            boxSpacing: 10,

            textOriginX: 0.5,
            textOriginY: 0.5,

            textAlignX: 0.5,
            textAlignY: 0.5,

            marginX: 70,
            marginY: 42,

            realWidth: 0,
            realHeight: 0,
            textHorizontalPadding: 25,
            textVerticalPadding: 25,

            noTintColor: "#ffffff",
            pointerOverColor: "#d9d9d9"
        }

        // Completar los parametros faltantes de los argumentos
        this.boxConfig = completeMissingProperties(boxConfig, DEFAULT_BOX_CONFIG);
        this.textConfig = completeMissingProperties(textConfig, DEFAULT_TEXT_CONFIG);

        // Crear la imagen de la caja de opciones
        this.box = scene.add.image(this.boxConfig.imgX, 0, this.boxConfig.img)
            .setOrigin(this.boxConfig.imgOriginX, this.boxConfig.imgOriginY).setScale(this.boxConfig.scaleX, this.boxConfig.scaleY).setAlpha(this.boxConfig.imgAlpha);

        if (boxConfig.realWidth == null) {
            this.boxConfig.realWidth = this.box.displayWidth - this.boxConfig.textHorizontalPadding * 2;
        }
        if (boxConfig.realHeight == null) {
            this.boxConfig.realHeight = this.box.displayHeight - this.boxConfig.textVerticalPadding * 2;
        }

        // Calcular la posicion de la caja dependiendo del numero total de cajas y su alineacion vertical total
        let totalHeight = (this.box.displayHeight + this.boxConfig.boxSpacing);
        let startY = (this.CANVAS_HEIGHT - totalHeight * totalOpts) * this.boxConfig.collectiveAlignY
            + this.box.displayHeight * this.boxConfig.imgOriginY
            + (0.5 - this.boxConfig.collectiveAlignY) * this.boxConfig.boxSpacing;
        let boxY = startY + (totalHeight * index) + this.boxConfig.collectiveTopMargin;
        this.box.y = boxY;


        // Crear el texto
        this.textObj = this.textObj = new TextArea(scene, 0, 0, this.boxConfig.realWidth, this.boxConfig.realHeight, text, this.textConfig)
            .setOrigin(this.boxConfig.textOriginX, this.boxConfig.textOriginY).setScale(this.boxConfig.scaleX, this.boxConfig.scaleY);

        // Calcular la posicion del texto segun la alineacion horizontal y vertical
        let textX = this.box.x
            - this.box.displayWidth * (0.5 - this.boxConfig.textAlignX)
            + this.boxConfig.marginX * (0.5 - this.boxConfig.textAlignX) * 2;

        let textY = this.box.y
            - this.box.displayHeight * (0.5 - this.boxConfig.textAlignY)
            + this.boxConfig.marginY * (0.5 - this.boxConfig.textAlignY) * 2;

        this.textObj.setPosition(textX, textY);

        this.textObj.adjustFontSize();

        // Anadir los elementos al container
        this.add(this.box);
        this.add(this.textObj);

        this.calculateRectangleSize(debug, "dialogBox");
        this.addAnimations(onClick);

        this.setVisible(false);
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