export default class DialogNode {
    /**
* Clase base para la informacion de los nodos de dialogo. Inicialmente esta todo vacio
*/
    constructor(scene) {
        this.scene = scene;
        
        this.id = "";                   // id del nodo dentro del objeto en el que se encuentra
        this.fullId = "";               // id completa del nodo en el archivo en general
        this.globalId = "";             // id completa del nodo de entre todos los nodos

        this.next = [];                 // posibles nodos siguientes
        this.nextIndex = 0;             // indice del siguiente nodo
        this.nextDelay = 0;             // retardo con el que se procesara el siguiente nodo
    }

    processNode() { }

    nextNode() {
        if (this.next.length > this.nextIndex) {
            // console.log(this.next[this.nextIndex]);

            setTimeout(() => {
                this.next[this.nextIndex].processNode();
            }, this.nextDelay);
        }
    }
}