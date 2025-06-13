export default class Translation {
    constructor() {
        this.i18next = this.currentScene.plugins.get("rextexttranslationplugin");
    }

    /**
     * Obtiene el texto traducido
     * @param {String} translationId - id completa del nodo en el que mirar
     * @param {Object} options - parametros que pasarle a i18n
     * @returns 
     */
    translate(translationId, options) {
        let str = this.i18next.t(translationId, options);

        // Si se ha obtenido algo
        if (str != null) {
            // Si el objeto obtenido no es un array, devuelve el texto con las expresiones <> reemplazadas
            if (!Array.isArray(str)) {
                if (str.text != null) {
                    return this.replaceGender(str.text);
                }
                else {
                    return this.replaceGender(str)
                }
            }
            // Si es un array
            else {
                // Recorre todos los elementos
                for (let i = 0; i < str.length; i++) {
                    // Si el elemento tiene la propiedad text, modifica el
                    // objeto original para reemplazar su contenido por el
                    // texto con las expresiones <> reemplazadas
                    if (str[i].text != null) {
                        str[i] = this.replaceGender(str[i].text);
                    }
                }
            }
        }
        return str;
    }
}