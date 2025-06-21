import TextNode from "../../framework/dialog/nodes/textNode.js";
import ChoiceNode from "../../framework/dialog/nodes/choiceNode.js";

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

            let fn = () => {
                this.processNode();
                this.cv.off("pointerdown", fn);
            }
            this.cv.on("pointerdown", fn);
        }
        else {
            super.processNode();
        }
    }

    nextNode() {
        if (this.next.length > this.nextIndex) {
            // Elimina los eventos de pulsar la caja de texto (ya que la comparten todos los nodos de texto)
            this.dialogBox.off("pointerdown");

            // Se para la animacion si el siguiente nodo es de texto y habla otro personaje
            if (this.next[this.nextIndex] instanceof TextNode) {
                let nextNodeCharacter = this.next[this.nextIndex].character;
                if (nextNodeCharacter != this.character) {
                    this.scene.dialogManager.playDefaultAnimation(this.character);
                }
            }

            // Si el siguiente nodo es de opcion multiple, se oculta la caja de texto y se pasa al siguiente nodo
            if (this.next[this.nextIndex] instanceof ChoiceNode) {
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
            // Se para la animacion si no quedan mas nodos
            this.scene.dialogManager.playDefaultAnimation(this.character);

            this.dialogBox.activate(false);
        }
    }

    /**
    * Pasa al siguiente fragmento de texto
    */
    nextFragment() {
        // Si la caja de texto no esta activa
        if (!this.dialogBox.visible && this.dialogs.length > 0) {
            // Se cambia el nombre antes de la animacion
            this.dialogBox.setName(this.name);

            this.scene.dialogManager.playTalkingAnimation(this.character);

            // Se activa la caja de texto y una vez activada, se pone el primer dialogo
            this.dialogBox.activate(true, () => {
                this.updateCurrDialog();
            });
        }
        // Si la caja de texto ya esta activa
        else {
            // Si el personaje que habla no es el mismo que antes, oculta la caja y vuelve a llamar a la funcoin
            if (this.dialogBox.lastCharacter != this.name) {

                this.dialogBox.activate(false, () => {
                    this.nextFragment();
                });
            }
            // Si no, se pasa al siguiente dialogo
            else {
                // Si sigue habiendo mas dialogos, se cambia en la caja de texto
                if (this.currDialog < this.dialogs.length) {
                    this.updateCurrDialog();
                }
                // Si no, se pasa al siguiente nodo
                else {
                    this.nextNode();
                }
            }
        }
    }
}