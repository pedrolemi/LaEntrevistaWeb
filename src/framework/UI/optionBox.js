import TextButton from "./textButton.js";
import { completeMissingProperties } from "../utils/misc.js"
import { DEFAULT_TEXT_CONFIG } from "../utils/graphics.js"
import TextArea from "./textArea.js";

export default class OptionBox extends TextButton {
    /**
    * Caja de texto para los dialogos
    * @extends TextButton
    * @param {Phaser.Scene} scene - escena en la que se crea (idealmente la escena de UI)
    * @param {Number} index - indice de la opcion de entre todas las opciones
    * @param {Number} totalOpts - numero total de opciones
    * @param {String} text - texto a mostrar en la opcion
    * @param {Function} onClick - funcion a ejecutar al pulsar la opcion (opcional)
    * @param {Object} boxConfig - configuracion de la caja de opcion (opcional)
    * @param {Object} textConfig - configuracion del texto de la caja (opcional)
    */
    constructor(scene, index, totalOpts, text, onClick = {}, boxConfig = {}, textConfig = {}) {
        super(scene, 0, 0, 0, 0);

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

            textMarginX: 70,
            textMarginY: 42,

            realWidth: 0,
            realHeight: 0,
            textHorizontalPadding: 25,
            textVerticalPadding: 25,

            noTintColor: "#ffffff",
            pointerOverColor: "#d9d9d9"
        }

        // TODO: Meter soporte para agrandar la caja si el texto no cabe (y/o para usar nineslice)

        // Completar los parametros faltantes de los argumentos
        this.boxConfig = completeMissingProperties(boxConfig, DEFAULT_BOX_CONFIG);
        this.textConfig = completeMissingProperties(textConfig, DEFAULT_TEXT_CONFIG);

        this.createImgButton(text, this.textConfig, onClick, this.boxConfig.img, this.boxConfig.imgOriginX, this.boxConfig.imgOriginY, this.boxConfig.scaleX, 
            this.boxConfig.scaleY, this.boxConfig.imgAlpha, this.boxConfig.textMarginX, this.boxConfig.textMarginY, this.boxConfig.textOriginX, this.boxConfig.textOriginY,
            this.boxConfig.textAlignX, this.boxConfig.textAlignY);

        // Se calcula el ancho en base a la imagen
        if (boxConfig.realWidth == null) {
            this.boxConfig.realWidth = this.image.displayWidth - this.boxConfig.textHorizontalPadding * 2;
        }
        if (boxConfig.realHeight == null) {
            this.boxConfig.realHeight = this.image.displayHeight - this.boxConfig.textVerticalPadding * 2;
        }

        if (textConfig.wordWrap != null) {
            this.textConfig.wordWrap.width = this.boxConfig.realWidth;
        }

        // Calcular la posicion de la caja dependiendo del numero total de cajas y su alineacion vertical total
        let totalHeight = (this.image.displayHeight + this.boxConfig.boxSpacing);
        let startY = (this.CANVAS_HEIGHT - totalHeight * totalOpts) * this.boxConfig.collectiveAlignY
            + this.image.displayHeight * this.boxConfig.imgOriginY
            + (0.5 - this.boxConfig.collectiveAlignY) * this.boxConfig.boxSpacing;
        let boxY = startY + (totalHeight * index) + this.boxConfig.collectiveTopMargin;
        
        // Actualizar la informacion de la caja
        this.rectWidth = this.boxConfig.realWidth;
        this.rectHeight = this.boxConfig.realHeight;

        // Se eliminan la imagen y el texto (necesario para actualizar correctamente los tamanos)
        this.image.destroy();
        this.textObj.destroy();
        this.removeAllListeners();

        // Se vuelve a crear la caja con las dimensiones bien calculadas 
        this.createImgButton(text, this.textConfig, onClick, this.boxConfig.img, this.boxConfig.imgOriginX, this.boxConfig.imgOriginY, this.boxConfig.scaleX, 
            this.boxConfig.scaleY, this.boxConfig.imgAlpha, this.boxConfig.textMarginX, this.boxConfig.textMarginY, this.boxConfig.textOriginX, this.boxConfig.textOriginY,
            this.boxConfig.textAlignX, this.boxConfig.textAlignY);


        this.posX = this.boxConfig.imgX;
        this.posY = boxY;
        this.setPosition(this.posX, this.posY);
        

        if (debug) {
            let textDebug = scene.add.rectangle(this.textObj.x, this.textObj.y, this.boxConfig.realWidth, this.boxConfig.realHeight, 0xfff, 0.5)
                .setOrigin(this.boxConfig.textOriginX, this.boxConfig.textOriginY).setScale(this.boxConfig.scaleX, this.boxConfig.scaleY);

            this.add(textDebug);
            this.bringToTop(this.textObj);
        }

        this.setVisible(false);
    }
}