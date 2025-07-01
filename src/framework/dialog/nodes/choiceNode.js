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
            ],
            "shuffle": true
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

    /**
    * @param {BaseScene} scene - escena en la que se crea el nodo
    * @param {Object} node - objeto json con la informacion del nodo
    * @param {String} fullId - id completa del nodo en el archivo
    * @param {String} namespace - nombre del archivo de localizacion del que se va a leer 
    */
    constructor(scene, node, fullId, namespace) {
        super(scene);

        this.choices = [];              // Lista con el texto traducido de cada opcion

        // Obtiene el texto traducido de las opciones y lo guarda en la lista
        this.choices = LocalizationManager.getInstance().translate(fullId, namespace, true);

        // Recorre cada opcion del nodo y guarda el nodo siguiente a cada opcion
        node.choices.forEach((choice) => {
            this.next.push(choice.next)
        });

        // Si se elige que el orden de las respuestas se aleatorio, se barajan tanto
        // el texto de las opciones como los nodos siguientes con el Fisher-Yates Shuffle
        if (node.shuffle != null && node.shuffle) {
            for (let i = this.choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]];
                [this.next[i], this.next[j]] = [this.next[j], this.next[i]];
            }
        }
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