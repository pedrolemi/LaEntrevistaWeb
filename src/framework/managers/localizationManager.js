import Singleton from "../utils/singleton.js";
import { splitByWord } from "../utils/misc.js";

export default class LocalizationManager extends Singleton {
    constructor() {
        super("LocalizationManager");

        this.i18next = null;
    }

    init(i18n) {
        this.i18next = i18n;
    }

    /**
    * Obtiene el texto traducido
    * @param {String} translationId - id completa del nodo en el que mirar
    * @param {Object} options - parametros que pasarle a i18n
    * @returns {String / Array } - texto o array con los textos traducidos
    */
    translate(translationId, namespace, returnObjects = true, otherOptions = {}) {
        let options = otherOptions;
        if (options.ns == null) {
            options.ns = namespace;
        }
        if (options.returnObjects == null) {
            options.returnObjects = returnObjects;
        }

        let str = this.i18next.t(translationId, options);

        // Si se ha obtenido algo
        if (str != null) {
            // Si el objeto obtenido no es un array,
            if (!Array.isArray(str)) {
                // Si el objeto tiene la propiedad text, se guarda
                if (str.text != null) {
                    str = str.text;
                }
                // Si no, el objeto es un string directamente
            }
            // Si es un array
            else {
                // Recorre todos los elementos guardando el texto
                for (let i = 0; i < str.length; i++) {
                    if (str[i].text != null) {
                        str[i] = str[i].text;
                    }
                    else {
                        str[i] = str;
                    }
                }
            }
        }
        return str;
    }


    /**
    * Reemplaza todas las expresiones regulares encontradas por el texto correspondiente
    * 
    * Ejemplo:
    *   "{{name}} es <<gender || male:un || female:una || ... >> joven con <<studies || fp: un grado superior de reposteria || uni: una licenciatura en derecho || ...>>."
    * 
    * De esta manera, si el valor de name es Jesse, el de gender es male y el de studies es fp, el texto resultante seria:
    *   Jesse es un joven con un grado superior de reposteria.
    * 
    * En caso de que el nombre de la variable no se encuentre o que su valor no coincida con ninguno
    * de los valores a sustituir, la expresion se sustituira por el nombre de la variable entre { }
    * 
    * Inmediatamente antes y despues de los caracteres separadores ("{{}}", "<<", ">>", "||" y ":") pueden ir cualquier 
    * numero de espacios (0 incluido), pero no se tendran en cuenta a la hora de reemplazar el texto y se omitiran
    * 
    * 
    * @param {String} inputText - texto en el que reemplazar las expresiones regulares
    * @param {Array[Map]} contextMaps - array de mapas en los que buscar el valor de la expresion a sustituir
    * (si alguna clave coincide, se guardara el valor que tenga dicha clave en el ultimo mapa del array)
    * @returns {String} - texto con las expresiones regulares reemplazadas
    */
    replaceRegularExpressions(inputText, contextMaps) {
        // Se unen los mapas del array en otro mapa
        const mergedContext = contextMaps.reduce((merged, current) => {
            for (const [key, value] of current) {
                merged.set(key, value);
            }
            return merged;
        }, new Map());

        // console.log(inputText)

        let result = this.replaceValues(inputText, mergedContext);
        result = this.replaceVariants(result, mergedContext);

        return result;
    }


    replaceValues(inputText, mergedContext) {
        // Expresion a sustituir (todo lo que haya entre {{}})
        let regex = /{{\s*([^>>]+\S)\s*}}/g;

        // console.log(inputText)

        // Encuentra todos los elementos entre {{}}
        let matches = [...inputText.matchAll(regex)];

        // console.log(matches)

        let result = "";
        let lastEndIndex = 0;

        // Por cada {{}}
        matches.forEach((match, index) => {
            // match devuelve un objeto en el que el primer elemento es toda la expresion 
            // regular incluidos {{}} y el segundo elemento es el texto contenido entre {{}}
            let [fullMatch, content] = match;

            // El nombre de la variable es todo el texto entre {{}} ignorando todos los espacios
            const variableName = content.replace(/\s*:\s*/g, ':');

            // El texto por defecto con el que se reemplazara es el nombre de la variable entre {{}}
            let replacement = "{" + variableName + "}";

            // Si existe la variable en el mapa, se  guarda su valor
            if (mergedContext.has(variableName)) {
                replacement = mergedContext.get(variableName);
            }

            // Anade el texto reemplazado al texto completo
            result += inputText.slice(lastEndIndex, match.index) + replacement;

            // Actualiza el indice del ultimo {{}} para el siguiente {{}}
            lastEndIndex = match.index + fullMatch.length;
        });

        // Anade el resto del texto al texto completo
        result += inputText.slice(lastEndIndex);
        return result;
    }

    replaceVariants(inputText, mergedContext) {
        // Expresion a sustituir (todo lo que haya entre <<>>)
        let regex = /<<([^>>]+)>>/g;

        // Encuentra todos los elementos entre <<>>
        let matches = [...inputText.matchAll(regex)];

        let result = "";
        let lastEndIndex = 0;

        // Por cada <<>>
        matches.forEach((match, index) => {
            // match devuelve un objeto en el que el primer elemento es toda la expresion 
            // regular incluidos <<>> y el segundo elemento es el texto contenido entre <<>>
            let [fullMatch, content] = match;

            // Se separa el texto por || ignorando los espacios para obtener todas las variaciones que tiene el texto
            let components = content.split("||").map(word => word.trim());

            // Se obtiene el nombre de la variable (el elemento anterior al primer "||") y se elimina de las variaciones
            let variableName = components[0];
            components.shift();

            // El texto por defecto con el que se reemplazara es el nombre de la variable entre {}
            let replacement = "{" + variableName + "}";
            let found = false;

            // Recorre cada variacion
            components.forEach((variation) => {
                // Mientras no se haya encontrado el texto con el que reemplazar la expresion
                if (!found) {
                    // console.log(variation);

                    // Se eliminan ls espacios antes y despues de los : para dividir el texto usandolos como separador
                    const noSpaces = variation.replace(/\s*:\s*/g, ':');
                    const parts = noSpaces.split(':');

                    // Si hay mas de 1 elemento en las partes es que hay valor para
                    // la variable y texto con el que reemplazar la expresion
                    if (parts.length >> 1) {
                        // El valor de la variable es el elemento anterior al primer ":"
                        let variableValue = parts[0];

                        // console.log(mergedContext, variableName, variableValue)

                        // Si el valor de la variable en el mapa es el mismo que el que se esta comprobando
                        if (mergedContext.get(variableName) == variableValue) {
                            // Se guarda todo el texto posterior al primer ":" y se eliminan los espacios iniciales
                            replacement = variation.substring(variation.indexOf(":") + 1);
                            replacement = replacement.trimStart();

                            found = true;
                        }
                    }
                }
            });

            // console.log(replacement)

            // Anade el texto reemplazado al texto completo
            result += inputText.slice(lastEndIndex, match.index) + replacement;

            // Actualiza el indice del ultimo <<>> para el siguiente <<>>
            lastEndIndex = match.index + fullMatch.length;
        });

        // Anade el resto del texto al texto completo
        result += inputText.slice(lastEndIndex);
        return result;
    }

    /**
    * Cambia el idioma actual de la aplicacion
    *
    * @param {String} language - Codigo del idioma a establecer (por ejemplo, 'en', 'es', 'fr').
    */
    changeLanguage(language) {
        this.i18next.changeLanguage(language);
    }

}