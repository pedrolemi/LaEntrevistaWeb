import EventDispatcher from "../managers/eventDispatcher.js";
import DefaultEventNames from "../utils/eventNames.js";

export default class DialogNode {
    /**
    * Clase base para la informacion de los nodos de dialogo. Inicialmente esta todo vacio
    * 
    * SI SE QUIEREN ANADIR NUEVOS NODOS QUE NO SEAN LOS 4 TIPOS BASICOS, LO IDEAL SERIA CREAR CLASES
    * NUEVAS QUE HEREDEN DE DIALOGNODE. PARA MODIFICAR EL COMPORTAMIENTO BASICO DE LOS NODOS YA 
    * EXISTENTES, LO MEJOR SERIA MODIFICAR LA GESTION DE LOS EVENTOS EN LAS CLASES CORRESPONDIENTES,
    * PERO NO MODIFICAR LOS NODOS DIRECTAMENTE
    */

    /**
    * @param {BaseScene} scene - escena en la que se crea el nodo
    */
    constructor(scene) {
        this.scene = scene;
        this.dispatcher = EventDispatcher.getInstance();

        this.id = "";                   // id del nodo dentro del objeto en el que se encuentra
        this.fullId = "";               // id completa del nodo en el archivo en general
        this.globalId = "";             // id completa del nodo de entre todos los nodos

        this.next = [];                 // posibles nodos siguientes
        this.nextIndex = 0;             // indice del siguiente nodo
        this.nextDelay = 0;             // retardo con el que se procesara el siguiente nodo
    }

    processNode() { }

    nextNode() {
        // Se dejan de escuchar los eventos para que no afecten a los nodos siguientes 
        // (ya que los nodos no se eliminan hasta que se elimine la escena en la que estan)
        this.dispatcher.removeByObject(this);

        if (this.next.length > this.nextIndex && this.next[this.nextIndex] != null) {
            // console.log(this.next[this.nextIndex]);

            setTimeout(() => {
                this.next[this.nextIndex].processNode();
            }, this.nextDelay);
        }
        else {
            this.dispatcher.dispatch(DefaultEventNames.endNodes);
        }
    }
}