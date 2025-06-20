export default class TextArea extends Phaser.GameObjects.Text {
    /**
    * Texto que tiene que estar contenido en un area especifica
    * @extends DialogObject
    * @param {Phaser.GameObjects.Text} scene - escena en la que se crea (idealmente la escena de UI)
    * @param {Number} x - posicion x del texto (opcional)
    * @param {Number} y - posicion y del texto (opcional)
    * @param {Number} maxWidth - ancho maximo que puede ocupar el texto (opcional)
    * @param {Number} maxHeight - alto maximo que puede ocupar el texto (opcional)
    * @param {String} text - texto a mostrar (opcional)
    * @param {Object} style - estilo del texto (opcional)
    */
    constructor(scene, x = 0, y = 0, maxWidth = 100, maxHeight = 100, text = "", style = {}) {
        super(scene, x, y, text, style);
        scene.add.existing(this);

        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }


    /**
    * Comprueba si el texto indicado cabe los limites establecidos
    * @param {String} text - texto a mostrar
    * @returns {Boolean} - true si el texto cabe, false en caso contrario
    */
    fits(text) {
        let prevText = this.text;
        this.setText(text);
        let fits = this.displayWidth <= this.maxWidth && this.displayHeight <= this.maxHeight;
        // console.log(text, this.displayWidth, this.displayHeight, this.maxWidth, this.maxHeight);
        this.setText(prevText);

        // console.log(fits);
        return fits;
    }


    /**
    * Ajusta automaticamente el tamano de la fuente hasta que quepa al menos 1 caracter
    * @param {String} text - primer caracter del texto a mostrar
    * @param {Number} reduction - reduccion que se le ira aplicando a la fuente cada vez que se compruebe si cabe o no 
    * 
    * IMPORTANTE: ESTE METODO VA RECONSTRUYENDO EL TEXTO CON UN TAMANO DE FUENTE CADA VEZ
    * MENOR Y COMPROBANDO SI CABE DENTRO DE LOS LIMITES DE LA CAJA, POR LO QUE SI EL TAMANO
    * DEL TEXTO ES ENORME O LA REDUCCION ES MUY PEQUENA, TARDARA MUCHO TIEMPO EN TERMINAR
    */
    adjustFontSize(text = "", reduction = 5) {
        if (text == "") {
            text = this.text;
        }
        if (text != "") {
            let textConfig = this.style;
            let fontSize = textConfig.fontSize.replace("px", "");

            while (this.maxWidth > 0 && this.maxHeight > 0 && text != "" && !this.fits(text)) {
                fontSize -= reduction;
                this.setFontSize(fontSize);
            }
        }


        // console.log(fontSize);
    }
}