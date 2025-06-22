import BaseScene from "../scenes/baseScene.js";
import DialogBox from "../UI/dialogBox.js"
import OptionBox from "../UI/optionBox.js";
import InteractiveContainer from "../UI/interactiveContainer.js";

export default class BaseUI extends BaseScene {
    /**
    * Clase base para la escena en la que se crean los elementos para la interfaz
    * @extends BaseScene
    */
    constructor(key = "UI") {
        super(key);

        this.textboxConfig = {}
        this.nameBoxConfig = {}
        this.textConfig = {}
        this.nameTextConfig = {}
        this.optionBoxConfig = {}

        this.optionBoxes = [];
    }


    create(params) {
        super.create(params);


        this.bgBlock = this.add.rectangle(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 0x000, 0).setOrigin(0, 0);
        this.bgBlock.setInteractive();

        this.bgElements = new InteractiveContainer(this, 0, 0);
        this.bgElements.setSize(1, 1);
        this.bgElements.add(this.bgBlock);
        this.bgElements.activate(false, () => { }, 0);


        this.textbox = new DialogBox(this, false, this.textboxConfig, this.nameBoxConfig, this.textConfig, this.nameTextConfig);

        this.configureTextboxEvents();
        this.configureChoicesEvents();

        // Si llega un evento de que se han acabado los nodos, desactiva la caja y quita el nodo del 
        this.dispatcher.add("endNodes", this, () => {
            this.textbox.activate(false);
        });
    }


    configureTextboxEvents() {
        this.textbox.on("pointerdown", () => { this.skipDialog(); });

        // Si llega un evento de empezar nodo de texto, comienza a procesarlo
        this.dispatcher.add("startTextNode", this, (node) => {
            // console.log(node);

            // Recorre todos los fragmentos obtenidos y los divide (por si
            // el texto es demasiado largo y no cabe en la caja de texto). 
            if (!node.textAdjusted) {
                let dialogs = [];

                node.dialogs.forEach((dialog) => {
                    this.splitDialog(dialogs, dialog);
                })
                node.dialogs = dialogs;
                node.textAdjusted = true;
            }

            // console.log(dialogs);

            this.startTextNode(node);
        });

        // Si llega un evento de actualizar el texto, lo cambia en la caja de texto
        this.dispatcher.add("updateTextNode", this, (node) => {
            this.textbox.setDialog(node.name, node.dialogs[node.currDialog]);
        });
    }

    startTextNode(node) {
        // Si la caja era visible y el personaje anterior es distinto al actual,
        // se desactiva la caja y se vuelve a activar con el nombre nuevo
        if (this.textbox.visible && this.textbox.lastCharacter != node.character) {
            this.textbox.activate(false, () => {
                this.textbox.setName(node.name, node.character);
                this.textbox.activate(true, () => {
                    this.textbox.setDialog(node.name, node.dialogs[node.currDialog]);
                });
            })
        }
        // Si no, si la caja no era visible o el personaje es el mismo, se activa
        // directamente con el nombre nuevo (si ya estaba activa, no hara la animacion)
        else {
            this.textbox.setName(node.name, node.character);
            this.textbox.activate(true, () => {
                this.textbox.setDialog(node.name, node.dialogs[node.currDialog]);
            });
        }
    }


    /**
    * Funcion llamada al pulsar la caja de texto
    */
    skipDialog() {
        // Si no se ha terminado de mostrar todo el dialogo, lo muestra de golpe
        if (!this.textbox.finished) {
            this.textbox.forceFinish();
        }
        // Si se ha pasado el retardo para poder saltar el dialogo, se pasa al siguiente
        else if (this.textbox.canSkip) {
            this.dispatcher.dispatch("nextDialog");
        }
    }

    /**
    * Divide el texto por si alguno es demasiado largo y se sale de la caja de texto
    * @param {String} text - texto a dividir
    */
    splitDialog(dialogs, text) {
        // Se divide el texto por palabras
        // TODO: Confirmar que soporta multiples idiomas
        const noSpaces = text.replace(/[\r\n]/g, " ");
        const splitText = noSpaces.split(" ").filter(x => x);

        // console.log(splitted)

        // Si el texto es muy grande para mostar siquiera un caracter, no hace nada
        if (!this.textbox.textFits(text[0][0])) {
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
            if (!this.textbox.textFits(nextWord)) {
                newText += " ";

                // Mientras quepa el texto con cada caracter de la palabra que no cabe y no se acabe dicha palabra
                while (this.textbox.textFits(newText + nextWord[0]) && nextWord.length > 0) {
                    // Se anade al texto actual el primer caracter de la palabra que no cabe y se elimina de dicha palabra
                    newText += nextWord[0];
                    nextWord = nextWord.slice(1);
                }
                if (newText != "") {
                    dialogs.push(newText);
                }
                newText = "";
                // Se mete el resto de la palabra al principio de la lista
                splitText.unshift(nextWord);
            }
            // Si el texto actual mas la palabra caben, se mantiene en el texto a guardar
            else if (this.textbox.textFits(newText + " " + nextWord)) {
                newText += " " + nextWord;
            }
            // Guarda en la lista de dialogos el dialogo leido
            else {
                dialogs.push(newText);
                newText = "";

                splitText.unshift(nextWord);
            }

            // console.log(newText);
            // console.log(splitText);
        }
        if (newText != "") {
            dialogs.push(newText);
        }
        // console.log(dialogs);
    }



    configureChoicesEvents() {
        this.dispatcher.add("startChoiceNode", this, (node) => {
            this.textbox.activate(false);
            this.createOptions(node);
        });
    }

    /**
    * Crea las opciones 
    * @param {ChoiceNode} node - nodo de eleccion con el array de opciones 
    */
    createOptions(node) {
        this.bgElements.activate(true);

        // Recorre todos los textos de las opciones
        for (let i = 0; i < node.choices.length; i++) {
            // Crea una OptionBox cuyo onClick establece como siguiente nodo el correspondiente 
            // al indice de la opcion elegida y elimina el resto de opciones
            let opt = new OptionBox(this, i, node.choices.length, node.choices[i], () => {
                node.nextIndex = i;
                node.nextNode();
                this.removeOptions();
            }, false, this.optionBoxConfig, this.textConfig);

            // Muestra la opcion
            opt.activate(true);

            // Guarda la OptionBox en el array
            this.optionBoxes.push(opt);
        }
    }

    /**
    * Elimina las opciones
    */
    removeOptions() {
        // Recorre cada opcion del array de OptionBox
        this.optionBoxes.forEach((option) => {
            // Oculta la opcion y cuando la termina de ocultar, destruye el objeto
            option.activate(false, () => {
                option.destroy();
                this.onOptionRemoval();
            });
        });
        this.optionBoxes = [];
    }

    /**
    * Funcion llamada al eliminar las opciones
    */
    onOptionRemoval() {
        if (this.optionBoxes.length <= 0) {
            this.bgElements.activate(false);
        }
    }
}