import InteractiveContainer from "./interactiveContainer.js";
import { completeMissingProperties } from "../utils/misc.js"
import { DEFAULT_TEXT_CONFIG } from "../utils/graphics.js"
import TextArea from "./textArea.js";

export default class DialogBox extends InteractiveContainer {
    /**
    * Caja de texto para los dialogos
    * @extends InteractiveContainer
    * @param {Phaser.Scene} scene - escena en la que se crea (idealmente la escena de UI)
    * @param {Boolean} debug - true para mostrar la caja de colision, false en caso contrario (opcional)
    * @param {Object} textboxConfig - configuracion de la caja de texto (opcional)
    * @param {Object} nameBoxConfig - configuracion de la caja de nombre (opcional)
    * @param {Object} textConfig - configuracion del texto de la caja de texto (opcional)
    * @param {Object} nameTextConfig - configuracion del texto de la caja de nombre (opcional)
    * @param {Number} textAnimDelay - tiempo en milisegundos que tarda cada caracter en aparecer (opcional)
    * @param {Number} skipDelay - tiempo en milisegundos que se tarda en poder saltar el dialogo tras mostrar todo el texto (opcional)
    */
    constructor(scene, debug = false, textboxConfig = {}, nameBoxConfig = {}, textConfig = {}, nameTextConfig = {}, textAnimDelay = 30, skipDelay = 200) {
        super(scene);

        let DEFAULT_TEXTBOX_CONFIG = {
            imgX: this.CANVAS_WIDTH / 2,
            imgY: this.CANVAS_HEIGHT * 0.77,
            img: "textbox",
            imgOriginX: 0.5,
            imgOriginY: 0.5,
            scaleX: 1,
            scaleY: 1,

            textX: 225,
            textY: 630,
            textOriginX: 0,
            textOriginY: 0,

            useAdvancedWrap: true,
            realWidth: this.CANVAS_WIDTH * 0.72,
            realHeight: 180,

            centered: false
        }

        let DEFAULT_NAMEBOX_CONFIG = {
            imgX: 310,
            imgY: 550,
            img: "nameBox",
            imgOriginX: 0.5,
            imgOriginY: 0.5,
            scaleX: 1,
            scaleY: 1,

            textX: 450,
            textY: 570,
            textOriginX: 0.5,
            textOriginY: 0.5,

            realWidth: 250,
            realHeight: 60,
        }

        // TODO: Meter soporte para nineslice


        // Completar los parametros faltantes de los argumentos
        this.textboxConfig = completeMissingProperties(textboxConfig, DEFAULT_TEXTBOX_CONFIG);
        this.nameBoxConfig = completeMissingProperties(nameBoxConfig, DEFAULT_NAMEBOX_CONFIG);
        this.textConfig = completeMissingProperties(textConfig, DEFAULT_TEXT_CONFIG);
        this.nameTextConfig = completeMissingProperties(nameTextConfig, DEFAULT_TEXT_CONFIG);

        this.textConfig.wordWrap = {
            width: (this.textboxConfig.useAdvancedWrap) ? this.textboxConfig.realWidth : null,
            useAdvancedWrap: this.textboxConfig.useAdvancedWrap
        }

        // Crear la imagen y el texto de la caja de texto
        this.box = scene.add.image(this.textboxConfig.imgX, this.textboxConfig.imgY, this.textboxConfig.img)
            .setOrigin(this.textboxConfig.imgOriginX, this.textboxConfig.imgOriginY).setScale(this.textboxConfig.scaleX, this.textboxConfig.scaleY);
        this.textObj = new TextArea(scene, this.textboxConfig.textX, this.textboxConfig.textY, this.textboxConfig.realWidth, this.textboxConfig.realHeight, "", this.textConfig, debug)
            .setOrigin(this.textboxConfig.textOriginX, this.textboxConfig.textOriginY).setScale(this.textboxConfig.scaleX, this.textboxConfig.scaleY);

        // Crear la imagen y el texto de la caja de nombre
        if (this.nameBoxConfig.img) {
            this.nameBox = scene.add.image(this.nameBoxConfig.imgX, this.nameBoxConfig.imgY, this.nameBoxConfig.img)
                .setOrigin(this.nameBoxConfig.imgOriginX, this.nameBoxConfig.imgOriginY).setScale(this.nameBoxConfig.scaleX, this.nameBoxConfig.scaleY);
        }
        this.nameTextObj = new TextArea(scene, this.nameBoxConfig.textX, this.nameBoxConfig.textY, this.nameBoxConfig.realWidth, this.nameBoxConfig.realHeight, "", this.nameTextConfig)
            .setOrigin(this.nameBoxConfig.textOriginX, this.nameBoxConfig.textOriginY).setScale(this.nameBoxConfig.scaleX, this.nameBoxConfig.scaleY);


        // Anadir los elementos al container
        this.add(this.box);
        this.add(this.textObj);
        if (this.nameBox != null) {
            this.add(this.nameBox);
        }
        this.add(this.nameTextObj);


        if (debug) {
            let textboxDebug = scene.add.rectangle(this.textboxConfig.textX, this.textboxConfig.textY, this.textboxConfig.realWidth, this.textboxConfig.realHeight, 0xfff, 0.5)
                .setOrigin(this.textboxConfig.textOriginX, this.textboxConfig.textOriginY).setScale(this.textboxConfig.scaleX, this.textboxConfig.scaleY);
            let nameBoxDebug = scene.add.rectangle(this.nameBoxConfig.textX, this.nameBoxConfig.textY, this.nameBoxConfig.realWidth, this.nameBoxConfig.realHeight, 0x000, 0.5)
                .setOrigin(this.nameBoxConfig.textOriginX, this.nameBoxConfig.textOriginY).setScale(this.nameBoxConfig.scaleX, this.nameBoxConfig.scaleY);
            this.setText("Lorem Ipsum");
            this.setName("NameNameNameName");

            this.add(textboxDebug);
            this.add(nameBoxDebug);
            this.bringToTop(this.textObj);
            this.bringToTop(this.nameTextObj);
        }


        // Animacion del texto
        this.textDelay = textAnimDelay;         // Tiempo que tarda en aparecer cada letra en milisegundos
        this.fullText = "";                     // Texto completo a escribir
        this.tempText = "";                     // Texto escrito hasta el momento
        this.timedEvent = null;                 // Evento llamado para escribir cada letra
        this.finished = false;                  // Si ha terminado de mostrar el texto o no
        this.canSkip = false;
        this.skipDelay = skipDelay;

        this.lastCharacter = "";

        this.calculateRectangleSize(debug, "dialogBox");

        this.setVisible(false);
    }


    /**
    * Cambia el texto del nombre del personaje hablando
    * @param {String} name - nombre del personaje
    */
    setName(name) {
        this.nameTextObj.setFontSize(this.nameTextConfig.fontSize);

        this.nameTextObj.setText(name);
        this.lastCharacter = name;

        this.nameTextObj.adjustFontSize();
    }

    /**
    * Cambia el texto que se muestra por pantalla
    * @param {String} text - texto a escribir
    */
    setText(text) {
        this.textObj.setText(text);
    }

    /**
    * Cambia el texto de la caja de nombre y la caja de texto
    * @param {String} character - nombre del personaje
    * @param {String} text - texto a escribir
    * @param {Boolean} animate - true si se quiere mostrar el texto letra a letra, false en caso contrario
    */
    setDialog(character, text, animate = true) {
        // Cambia el nombre
        this.setName(character);

        // Si no se va a animar, cambia todo el texto directamente
        if (!animate) {
            this.fullText = text;
            this.setDelayedFinish();

            this.setText(text);
        }
        // Si no
        else {
            // Limpia los eventos
            if (this.timedEvent != null) {
                this.timedEvent.remove();
            }

            this.fullText = text;
            this.tempText = "";
            this.finished = false;
            this.canSkip = false;

            this.setText(this.tempText);

            // Se crea el evento 
            this.timedEvent = this.scene.time.addEvent({
                delay: this.textDelay,
                callback: this.animateText,
                callbackScope: this,
                loop: true
            });
        }
    }

    /**
    * Anima el texto para que vaya apareciendo caracter a caracter
    */
    animateText() {
        // Si aun no se ha mostrado todo el texto
        if (!this.finished && this.fullText != null) {
            // Anade al texto a mostrar el caracter siguiente del texto completo
            this.tempText += this.fullText[this.tempText.length]

            // Cambia el texto a mostrar por el texto actual + el nuevo caracter a escribir
            this.setText(this.tempText);

            // Si se ya se han escrito todos los caracteres, elimina el evento
            if (this.tempText.length == this.fullText.length) {
                this.timedEvent.remove();
                this.setDelayedFinish();
            }
        }
    }

    /**
    * Muestra de golpe el dialogo completo
    */
    forceFinish() {
        if (this.timedEvent != null) {
            this.timedEvent.remove();
        }
        this.setDelayedFinish()
        this.setText(this.fullText);
    }

    setDelayedFinish() {
        this.finished = true;
        setTimeout(() => {
            this.canSkip = true;
        }, this.skipDelay);

    }


    activate(active, onComplete = {}, delay = 0) {
        super.activate(active, onComplete, delay);

        this.fadeAnim.on("complete", () => {
            if (!active) {
                this.setDialog("", "", false);
            }
        });
    }


    /**
    * Comprueba si el texto indicado cabe en la caja de texto
    * @param {String} text - texto a mostrar
    * @returns {Boolean} - true si el texto cabe, false en caso contrario
    */
    textFits(text) {
        return this.textObj.fits(text);
    }
}