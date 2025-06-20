import TextNode from "./baseClasses/textNode.js";

export default class LaEntrevistaTextNode extends TextNode {
    constructor(scene, node, fullId, namespace) {
        super(scene, node, fullId, namespace);

        this.cv = scene.dialogManager.scene.cv;
        this.functionSet = false;
    }

    processNode() {
        // Si el cv es visible, no se procesa el nodo hasta que se pulse sobre el
        if (this.cv.visible && !this.functionSet) {
            this.functionSet = true;

            this.cv.on("pointerdown", () => {
                this.processNode();
                this.cv.resetOnPointerDown();
            });
        }
        else {
            // Al hacer click en la caja de texto, se procesara de nuevo el nodo
            this.dialogBox.on("pointerdown", () => {
                this.skipDialog();
            });

            this.currDialog = 0;
            if (this.dialogs.length > 0) {
                this.nextFragment();
            }
            else {
                this.nextNode();
            }
        }
    }

    nextNode() {
        if (this.next.length > this.nextIndex) {
            // Elimina los eventos de pulsar la caja de texto (ya que la comparten todos los nodos de texto)
            this.dialogBox.off("pointerdown");

            // Si el siguiente nodo es de opcion multiple, se oculta la caja de texto y se pasa al siguiente nodo
            if (this.next[this.nextIndex].choices != null) {
                this.dialogBox.activate(false, () => {
                    setTimeout(() => {
                        this.next[this.nextIndex].processNode();
                    }, this.nextDelay);
                });
            }
            // Si no, se pasa al siguiente nodo sin ocultar la caja de texto
            else {
                setTimeout(() => {
                    this.next[this.nextIndex].processNode();
                }, this.nextDelay);
            }
        }
        else {
            this.dialogBox.activate(false);
        }
    }
}