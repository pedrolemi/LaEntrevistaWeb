export default class Localization {
    /**
    * Gestiona la carga de los nodos de dialogo
    */
    constructor(i18n) {
        this.i18next = i18n;
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
                    return str.text;

                    // TODO: Arreglar para soportar reemplazo de expresiones regulares
                    // return this.replaceGender(str.text);
                }
                else {
                    return str;

                    // TODO: Arreglar para soportar reemplazo de expresiones regulares
                    // return this.replaceGender(str)
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
                        str[i] = str[i].text;

                        // TODO: Arreglar para soportar reemplazo de expresiones regulares
                        // str[i] = this.replaceGender(str[i].text);
                    }
                }
            }
        }
        return str;
    }


    /**
    * Reemplaza en el string indicado todos los contenidos que haya entre <>
    * con el formato: <player, male expression, female expression >, en el que 
    * la primera variable es el contexto a comprobar y las otras dos expresiones
    * son el texto por el que sustituir todo lo que hay entre <>
    * @param {String} inputText - texto en el que reemplazar las expresiones <>
    * @returns {String} - texto con las expresiones <> reemplazadas
    */
    replaceGender(inputText) {
        // Expresion a sustituir (todo lo que haya entre <>)
        let regex = /<([^>]+)>/g;

        // Encuentra todos los elementos entre <>
        let matches = [...inputText.matchAll(regex)];

        let result = '';
        let lastEndIndex = 0;
        // Por cada <>
        matches.forEach((match, index) => {
            // Obtiene todo el contenido entre <> y lo separa en un array
            let [fullMatch, content] = match;
            let variable = content.split(", ");

            // Elige que variable se usara para comprobar el contexto
            let useContext = null;
            if (variable[0] === "player") {
                useContext = this.userInfo.gender;
            }
            else if (variable[0] === "harasser") {
                useContext = this.userInfo.harasser;
            }

            // Elige el texto por el que reemplazar la expresion dependiendo del contexto
            let replacement = "";
            if (useContext != null) {
                if (useContext === "male") {
                    replacement = variable[1];
                }
                else if (useContext === "female") {
                    replacement = variable[2];
                }
            }

            // Anade el texto reemplazado al texto completo
            result += inputText.slice(lastEndIndex, match.index) + replacement;

            // Actualiza el indice del ultimo <> para el siguiente <>
            lastEndIndex = match.index + fullMatch.length;
        });

        // Anade el resto del texto al texto completo
        result += inputText.slice(lastEndIndex);
        return result;
    }
}