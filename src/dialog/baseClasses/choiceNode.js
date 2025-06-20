import DialogNode from "./dialogNode.js";
import OptionBox from "../../UI/optionBox.js";

export default class ChoiceNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de opcion multiple
    * @extends DialogNode
    * 
    * IMPORTANTE: DEPENDE DE QUE EXISTA EL DIALOGMANAGER EN UNA ESCENA PARA LA UI,
    * YA QUE LAS CAJAS DE SELECCION NECESITAN UNA ESCENA EN LA QUE CREARSE
    * 
    * Ejemplo:
        {
            "type": "choice",
            "choices":[
                { "next": "choice1" },
                { "next": "choice1" }
            ]
        }
    */
    constructor(scene, node, fullId, namespace) {
        super(scene);

        this.choices = [];              // Lista con el texto traducido de cada opcion
        this.options = [];              // Lista de OptionBox creadas

        // Obtiene el texto traducido de las opciones y lo guarda en la lista
        this.choices = scene.dialogManager.translate(fullId, namespace, true);

        // Recorre cada opcion del nodo y guarda el nodo siguiente a cada opcion
        node.choices.forEach((choice) => {
            this.next.push(choice.next)
        });

        // Obtiene la escena en la que se van a crear las opcines (la UI) y la configuracion de las opciones
        this.ui = scene.dialogManager.scene;
        this.textConfig = this.ui.textConfig;
        this.optionBoxConfig = this.ui.optionBoxConfig;
    }

    processNode() {
        this.createOptions();
    }


    /**
    * Elimina las opciones
    */
    removeOptions() {
        let processed = false;

        // Recorre cada opcion del array de OptionBox
        this.options.forEach((option) => {
            // Oculta la opcion y cuando la termina de ocultar, destruye el objeto
            option.activate(false, () => {
                option.destroy();

                // Si no se habia eliminado antes ninguna opcion, se marca 
                // que se ha eliminado alguna y se pasa al siguiente nodo
                if (!processed) {
                    processed = true;
                    this.nextNode();
                }
            });
        });

        // Limpia la lista de OptionBox
        this.options = [];
    }

    /**
    * Crea las opciones 
    */
    createOptions() {
        // Limpia las opciones que hubiera anteriormente
        this.removeOptions();

        // Recorre todos los textos de las opciones
        for (let i = 0; i < this.choices.length; i++) {
            // Crea una OptionBox cuyo onClick establece como siguiente nodo el correspondiente 
            // al indice de la opcion elegida y elimina el resto de opciones
            let opt = new OptionBox(this.ui, i, this.choices.length, this.choices[i], () => {
                this.nextIndex = i;
                this.removeOptions();
            }, false, this.optionBoxConfig, this.textConfig);

            // Muestra la opcion
            opt.activate(true);

            // Guarda la OptionBox en el array
            this.options.push(opt);
        }
    }


}