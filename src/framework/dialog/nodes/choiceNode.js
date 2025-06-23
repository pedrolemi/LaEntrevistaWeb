import DialogNode from "../dialogNode.js";
import LocalizationManager from "../../managers/localizationManager.js";
import DefaultEventNames from "../../utils/eventNames.js";

export default class ChoiceNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de opcion multiple
    * @extends DialogNode
    * 
    * Ejemplo:
        "nodeName": {
            "type": "choice",
            "choices":[
                { "next": "choice1" },
                { "next": "choice2" },
                { ... }
            ]
        }
    *
    * Archivo de localizacion:
        "nodeName": [
            {
                text: "text choice 1"
            },
            {
                text: "text choice 2"
            },
            { ... }
        ]
    */

    static TYPE = "choice";

    constructor(node, fullId, namespace) {
        super();

        this.choices = [];              // Lista con el texto traducido de cada opcion

        // Obtiene el texto traducido de las opciones y lo guarda en la lista
        this.choices = LocalizationManager.getInstance().translate(fullId, namespace, true);

        // Recorre cada opcion del nodo y guarda el nodo siguiente a cada opcion
        node.choices.forEach((choice) => {
            this.next.push(choice.next)
        });
    }

    processNode() {
        if (this.choices.length > 0) {
            this.dispatcher.dispatch(DefaultEventNames.startChoiceNode, this);
        }
        else {
            this.nextNode();
        }
    }
}