import DialogNode from "../dialogNode.js";

export default class EventNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de evento
    * @extends DialogNode
    * 
    * Ejemplo:
        "nodeName": {
            "type": "event",
            "events": [
                {
                    "name": "talked",
                    "variable": "talked",
                    "global": false,
                    "value": true,
                    "delay": 20
                },
                {...}
            ],
            "next": "checkTalked"
        }
    */

    static TYPE = "event";

    /**
    * @param {BaseScene} scene - escena en la que se crea el nodo
    * @param {Object} node - objeto json con la informacion del nodo
    */
    constructor(scene, node) {
        super(scene);
        this.events = [];       // eventos que se llamaran al procesar el nodo (nombre del evento y el retardo con el que se llama)

        let evts = node.events;

        // Recorre todos los eventos del array de eventos y se guardan en la lista de eventos
        evts.forEach((evt) => {
            // Si se define una variable a cambiar en el evento
            if (evt.variable != null) {
                // Determina en que blackboard modificar la variable. Si no se ha definido si es global, o si se
                // ha definido que si lo es, se guarda en la del gameManager. Si no, se guarda en la de la escena
                let blackboard = scene.blackboard;
                if (scene.gameManager != null && (evt.global == null || evt.global === true)) {
                    blackboard = scene.gameManager.blackboard;
                }

                // Se guarda en la condicion en que blackboard comprobar su valor
                evt.blackboard = blackboard;
            }
            this.events.push(evt);
        });

        // Si hay un nodo despues de este, se guarda su id en la lista de nodos siguientes
        if (node.next != null) {
            this.next.push(node.next);
        }
    }

    processNode() {
        // Recorre todos los eventos del nodo y les hace dispatch con el delay establecido (si tienen)
        for (let i = 0; i < this.events.length; i++) {
            let evt = this.events[i];

            let delay = 0
            if (evt.delay) {
                delay = evt.delay;
            }
            setTimeout(() => {
                // Si el evento establece el valor de una variable, lo cambia en la 
                // blackboard correspondiente (la de la escena o la del gameManager)
                if (evt.blackboard != null) {
                    // console.log(evt.blackboard, evt.variable, evt.value)
                    evt.blackboard.set(evt.variable, evt.value);
                }

                this.dispatcher.dispatch(evt.name, evt);
                // console.log("dispatching",evt.name);
            }, delay);
        }
        this.nextNode();
    }
}