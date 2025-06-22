import DialogNode from "../dialogNode.js";
import OptionBox from "../../UI/optionBox.js";
import InteractiveContainer from "../../UI/interactiveContainer.js";
import LocalizationManager from "../../managers/localizationManager.js";

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

    static TYPE = "choice";

    constructor(scene, node, fullId, namespace) {
        super(scene);

        this.choices = [];              // Lista con el texto traducido de cada opcion
        this.options = [];              // Lista de OptionBox creadas

        // Obtiene el texto traducido de las opciones y lo guarda en la lista
        this.choices = LocalizationManager.getInstance().translate(fullId, namespace, true);

        // Recorre cada opcion del nodo y guarda el nodo siguiente a cada opcion
        node.choices.forEach((choice) => {
            this.next.push(choice.next)
        });

        // Obtiene la escena en la que se van a crear las opcines (la UI) y la configuracion de las opciones
        this.ui = scene.dialogManager.scene;
        this.textConfig = this.ui.textConfig;
        this.optionBoxConfig = this.ui.optionBoxConfig;

        this.bgBlock = null;
        this.onHideOptions = () => { };
    }

    processNode() {
        this.createOptions();
    }

    nextNode() {
        super.nextNode();
        
        this.onHideOptions = () => {
            // this.bgBlock.destroy();
        };
        this.removeOptions();
    }


    /**
    * Crea las opciones 
    */
    createOptions() {
        this.bgBlock = new InteractiveContainer(this.ui, 0, 0);
        this.bgBlockRect = this.ui.add.rectangle(0, 0, this.ui.CANVAS_WIDTH, this.ui.CANVAS_HEIGHT, 0x000, 0).setOrigin(0, 0);
        this.bgBlock.add(this.bgBlockRect);
        this.bgBlock.calculateRectangleSize();
        this.bgBlock.setVisible(false);

        this.bgBlock.activate(true);

        // Recorre todos los textos de las opciones
        for (let i = 0; i < this.choices.length; i++) {
            // Crea una OptionBox cuyo onClick establece como siguiente nodo el correspondiente 
            // al indice de la opcion elegida y elimina el resto de opciones
            let opt = new OptionBox(this.ui, i, this.choices.length, this.choices[i], () => {
                this.nextIndex = i;
                this.nextNode();
            }, false, this.optionBoxConfig, this.textConfig);

            // Muestra la opcion
            opt.activate(true);

            // Guarda la OptionBox en el array
            this.options.push(opt);
        }
    }

    /**
    * Elimina las opciones
    */
    removeOptions() {
        let onHideCalled = false;

        // Recorre cada opcion del array de OptionBox
        this.options.forEach((option) => {
            // Oculta la opcion y cuando la termina de ocultar, destruye el objeto
            option.activate(false, () => {
                option.destroy();
            });
        });

        this.bgBlock.activate(false, () => {
            this.onHideOptions();
        })
        // Limpia la lista de OptionBox
        this.options = [];
    }

}