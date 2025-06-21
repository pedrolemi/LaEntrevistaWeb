import LocalizationManager from "../../managers/localizationManager.js";
import DialogNode from "../dialogNode.js";
import ChoiceNode from "./choiceNode.js";

export default class TextNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de texto
    * @extends DialogNode
    * 
    * IMPORTANTE: DEPENDE DE QUE EXISTA EL DIALOGMANAGER EN UNA ESCENA PARA LA UI Y QUE DICHA ESCENA TENGA CREADA LA DIALOGBOX
    * 
    * Ejemplo:
        {
            "type": "text",
            "character": "mom",
            "next": "setNotTalked"
            "centered": "true"
        }
    */

    static type = "text";

    constructor(scene, node, fullId, namespace) {
        super(scene);
        let localizationManager = LocalizationManager.getInstance();

        // Se obtiene la id y nombre traducido del personaje
        this.character = node.character;                                            // id del personaje que habla
        this.name = localizationManager.translate(this.character, "names");         // nombre traducido del personaje que habla

        this.dialogs = [];                                                          // serie de dialogos que se van a mostrar
        this.currDialog = 0;                                                        // indice del dialogo que se esta mostrando

        this.centered = (node.centered == null) ? false : node.centered;            // indica si el texto esta centrado o no (en caso de que no se especifique aparece alineado arriba a la izquierda)

        // Se obtiene el dialogo traducido
        let ui = scene.dialogManager.scene;
        this.dialogBox = ui.textbox;
        let translation = localizationManager.translate(fullId, namespace, true);

        // Si el texto no esta dividido en fragmentos, se guarda en el array de fragmentos
        // si no, el array de fragmentos es directamente el obtenido al traducir el nodo
        let textFragments = [];
        if (!Array.isArray(translation) && translation != "") {
            textFragments.push(translation);
        }
        else if (Array.isArray(translation) && translation.length > 0) {
            textFragments = translation;
        }
    }


    /**
    * Divide el texto por si alguno es demasiado largo y se sale de la caja de texto
    * @param {String} text - texto a dividir
    */
    split(text) {
        // Se divide el texto por palabras
        // TODO: Confirmar que soporta multiples idiomas
        const noSpaces = text.replace(/[\r\n]/g, " ");
        const splitText = noSpaces.split(" ").filter(x => x);

        // console.log(splitted)

        // Si el texto es muy grande para mostar siquiera un caracter, no hace nada
        if (!this.dialogBox.textFits(text[0][0])) {
            console.warn("Dialog box text size too big! Returning empty dialog");
            return;
        }

        let newText = "";
        // Mientras queden palabras en el array
        while (splitText.length > 0) {
            // Saca la siguiente palabra de la lista de palabras
            let nextWord = splitText.shift();

            // Si no caben porque la palabra entera no cabe en la caja de texto
            // IMPORTANTE: ESTE METODO VA RECONSTRUYENDO EL TEXTO CON CADA LETRA NUEVA Y COMPROBANDO SI CABE DENTRO DE LOS LIMITES
            // DE LA CAJA, POR LO QUE SI LA PALABRA ES LARGUISIMA O LA FUENTE ES ENORME, TARDARA MUCHO TIEMPO EN TERMINAR
            if (!this.dialogBox.textFits(nextWord)) {
                newText += " ";

                // Mientras quepa el texto con cada caracter de la palabra que no cabe y no se acabe dicha palabra
                while (this.dialogBox.textFits(newText + nextWord[0]) && nextWord.length > 0) {
                    // Se anade al texto actual el primer caracter de la palabra que no cabe y se elimina de dicha palabra
                    newText += nextWord[0];
                    nextWord = nextWord.slice(1);
                }
                if (newText != "") {
                    this.dialogs.push(newText);
                }
                this.dialogs.push(newText);
                newText = "";
                // Se mete el resto de la palabra al principio de la lista
                splitText.unshift(nextWord);
            }
            // Si el texto actual mas la palabra caben, se mantiene en el texto a guardar
            else if (this.dialogBox.textFits(newText + " " + nextWord)) {
                newText += " " + nextWord;
            }
            // Guarda en la lista de dialogos el dialogo leido
            else {
                this.dialogs.push(newText);
                newText = "";

                splitText.unshift(nextWord);
            }

            // console.log(newText);
            // console.log(splitText);
        }
        if (newText != "") {
            this.dialogs.push(newText);
        }
        // console.log(this.dialogs);
    }


    processNode() {
        // Al hacer click en la caja de texto, se procesara de nuevo el nodo
        this.onClick = () => {
            this.skipDialog();
        }
        this.dialogBox.on("pointerdown", this.onClick);

        this.currDialog = 0;
        if (this.dialogs.length > 0) {
            this.nextFragment();
        }
        else {
            this.nextNode();
        }
    }

    nextNode() {
        // Elimina el evento de pulsar la caja de texto (ya que la comparten todos los nodos de texto)
        this.dialogBox.off("pointerdown", this.onClick);

        if (this.next.length > this.nextIndex) {
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
            this.dialogBox.activate(false);
        }
    }


    /**
    * Pone en la caja de texto el dialogo actual
    */
    updateCurrDialog() {
        // console.log(this.dialogs[this.currDialog]);
        this.dialogBox.setDialog(this.name, this.dialogs[this.currDialog]);
    }

    /**
    * Salta el dialogo
    */
    skipDialog() {
        // Si no se ha terminado de mostrar todo el dialogo, lo muestra de golpe
        if (!this.dialogBox.finished) {
            this.dialogBox.forceFinish();
        }
        // Si se ha pasado el retardo para poder saltar el dialogo, se pasa al siguiente
        else if (this.dialogBox.canSkip) {
            this.currDialog++;
            this.nextFragment();
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