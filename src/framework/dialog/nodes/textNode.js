import DialogNode from "../dialogNode.js";
import LocalizationManager from "../../managers/localizationManager.js";
import DefaultEventNames from "../../utils/eventNames.js";

export default class TextNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de texto
    * @extends DialogNode
    * 
    * Ejemplo:
        "nodeName": {
            "type": "text",
            "character": "mom",
            "next": "setNotTalked"
            "centered": "true"
        }
    *
    * Archivo de localizacion:
    *   Para un solo fragmento de texto:
            "nodeName": {
                text: "text fragment 1"
            },
    *
    *   Para varios fragmentos de texto (funciona tambien con uno solo):
            "nodeName": [
                {
                    text: "text fragment 1"
                },
                {
                    text: "text fragment 2"
                },
                { ... }
            ] 
    */

    static TYPE = "text";

    constructor(node, fullId, namespace) {
        super();
        let localizationManager = LocalizationManager.getInstance();

        // Se obtiene la id y nombre traducido del personaje
        this.character = node.character;                                            // id del personaje que habla
        this.name = localizationManager.translate(this.character, "names");         // nombre traducido del personaje que habla

        this.dialogs = [];                                                          // serie de dialogos que se van a mostrar
        this.currDialog = 0;                                                        // indice del dialogo que se esta mostrando

        this.centered = (node.centered == null) ? false : node.centered;            // indica si el texto esta centrado o no (en caso de que no se especifique aparece alineado arriba a la izquierda)

        // Se obtiene el dialogo traducido
        let translation = localizationManager.translate(fullId, namespace, true);

        // Si el texto no esta dividido en fragmentos, se guarda en el array de fragmentos
        // si no, el array de fragmentos es directamente el obtenido al traducir el nodo
        if (!Array.isArray(translation) && translation != "") {
            this.dialogs.push(translation);
        }
        else if (Array.isArray(translation) && translation.length > 0) {
            this.dialogs = translation;
        }

        // Guarda el siguiente nodo en la lista de siguientes
        if (node.next != null && node.next != "") {
            this.next.push(node.next);
        }

        this.textAdjusted = false;
    }

    processNode() {
        this.currDialog = 0;
        // Si hay dialogos
        if (this.dialogs.length > 0) {
            // Se lanza el evento de empezar nodo de texto
            this.dispatcher.dispatch(DefaultEventNames.startTextNode, this);

            // Se escucha el evento de siguiente dialogo
            this.dispatcher.add(DefaultEventNames.nextDialog, this, () => {
                // Se actualiza el dialogo
                this.currDialog++;

                // Si sigue habiendo mas dialogos, se lanza el evento de pasar al siguiente dialogo
                if (this.currDialog < this.dialogs.length) {
                    this.dispatcher.dispatch(DefaultEventNames.updateTextNode, this);
                }
                // Si no, pasa al siguiente nodo
                else {
                    this.nextNode();
                }
            });
        }
    }
}