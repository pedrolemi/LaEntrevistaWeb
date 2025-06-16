import DialogNode from "./dialogNode.js";
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
    constructor(scene, node, fullId, namespace) {
        super();

        // Se obtiene la id y nombre traducido del personaje
        this.character = node.character;                                            // id del personaje que habla
        this.name = scene.dialogManager.translate(this.character, "names");         // nombre traducido del personaje que habla

        this.dialogs = [];                                                          // serie de dialogos que se van a mostrar
        this.currDialog = 0;                                                     // indice del dialogo que se esta mostrando

        this.centered = (node.centered == null) ? false : node.centered;            // indica si el texto esta centrado o no (en caso de que no se especifique aparece alineado arriba a la izquierda)

        // Se obtiene el dialogo traducido
        let translation = scene.dialogManager.translate(fullId, namespace, true);
        this.dialogBox = scene.dialogManager.scene.textbox;

        // Si el texto no esta dividido en fragmentos, se guarda en el array de fragmentos
        // si no, el array de fragmentos es directamente el obtenido al traducir el nodo
        let textFragments = [];
        if (!Array.isArray(translation)) {
            textFragments.push(translation);
        }
        else {
            textFragments = translation;
        }

        // Recorre todos los fragmentos obtenidos y los divide (por si
        // el texto es demasiado largo y no cabe en la caja de texto)
        textFragments.forEach((text) => {
            this.split(text);
        })

        // Guarda el siguiente nodo en la lista de siguientes
        if (node.next != null && node.next != "") {
            this.next.push(node.next);
        }
        // console.log(this.dialogs)
    }

    processNode() {
        // Al hacer click en la caja de texto, se procesara de nuevo el nodo
        this.dialogBox.on("pointerdown", () => {
            this.skipDialog();
        });

        this.currDialog = 0;
        this.nextFragment();
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


    /**
    * Divide el texto por si alguno es demasiado largo y se sale de la caja de texto
    * @param {StreamPipeOptions} text - texto a dividir
    */
    split(text, autoAdjustFontSize = false) {
        // Se divide el texto por palabras
        // TODO: Comprobar que soporta multiples idiomas
        const noSpaces = text.replace(/[\r\n]/g, " ");
        const splitText = noSpaces.split(" ").filter(x => x);

        // console.log(splitted)

        if (autoAdjustFontSize) {
            this.adjustFontSize(text);
        }
        
        // Mientras queden palabras en el array
        while (splitText.length > 0 && this.dialogBox.textFits(text[0][0])) {
            let newText = "";
            let nextWord = "";

            // Mientras queden palabras en el array y el texto actual 
            // mas la siguiente palabra quepan en la caja de texto
            while (this.dialogBox.textFits(newText + " " + nextWord) && splitText.length > 0) {
                // Saca la siguiente palabra de la lista de palabras
                nextWord = splitText.shift();

                // Si el texto actual mas la palabra caben, se mantiene en el texto a guardar
                if (this.dialogBox.textFits(newText + " " + nextWord)) {
                    newText += " " + nextWord;
                }
                // Si no caben porque la palabra entera no cabe en la caja de texto
                // IMPORTANTE: ESTE METODO VA RECONSTRUYENDO EL TEXTO CON CADA LETRA NUEVA Y COMPROBANDO SI CABE DENTRO DE LOS LIMITES
                //  DE LA CAJA, POR LO QUE SI LA PALABRA ES LARGUISIMA O LA FUENTE ES ENORME, TARDARA MUCHO TIEMPO EN TERMINAR
                else if (!this.dialogBox.textFits(nextWord)) {
                    newText += " ";

                    // Mientras quepa el texto con cada caracter de la palabra que no cabe y no se acabe dicha palabra
                    while (this.dialogBox.textFits(newText + nextWord[0]) && nextWord.length > 0) {
                        // Se anade al texto actual el primer caracter de la palabra que no cabe y se elimina de dicha palabra
                        newText += nextWord[0];
                        nextWord = nextWord.slice(1);
                    }
                    // Se mete el resto de la palabra al principio de la lista
                    splitText.unshift(nextWord);
                }
                // Si no caben porque la palabra ya no entra en la caja, se vuelve a meter al principio de la lista
                else {
                    splitText.unshift(nextWord);
                }
            }
            // Guarda en la lista de dialogos el dialogo leido
            this.dialogs.push(newText);
        }
        // console.log(this.dialogs)
    }

    /**
    * Ajusta automaticamente el tamano de la fuente hasta que quepa al menos 1 caracter 
    * @param {String} text - texto a mostrar 
    * 
    * IMPORTANTE: ESTE METODO VA RECONSTRUYENDO EL TEXTO CON UN TAMANO DE FUENTE CADA VEZ
    * MENOR Y COMPROBANDO SI CABE DENTRO DE LOS LIMITES DE LA CAJA, POR LO QUE SI EL TAMANO
    * DEL TEXTO ES ENORME O LA REDUCCION ES MUY PEQUENA, TARDARA MUCHO TIEMPO EN TERMINAR
    */
    adjustFontSize(text, reduction = 5) {
        while (!this.dialogBox.textFits(text[0][0])) {
            let textConfig = this.dialogBox.textConfig;
            
            let fontSize = textConfig.fontSize.replace("px", "");
            fontSize -= reduction;
            textConfig.fontSize = fontSize + "px";

            this.dialogBox.textObj.setStyle(textConfig);
        }
    }


    /**
    * Pone en la caja de texto el dialogo actual
    */
    setDialog() {
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
        if (!this.dialogBox.visible) {
            // Se cambia el nombre antes de la animacion
            this.dialogBox.setName(this.name);

            // Se activa la caja de texto y una vez activada, se pone el primer dialogo
            this.dialogBox.activate(true, () => {
                this.setDialog();
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
                    this.setDialog();
                }
                // Si no, se pasa al siguiente nodo
                else {
                    this.nextNode();
                    // this.dialogBox.setDialog(this.name, "", false);
                }
            }
        }
    }
}