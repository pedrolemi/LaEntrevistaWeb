import Singleton from "../../framework/utils/singleton.js";
import NodeReader from "../../framework/dialog/nodeReader.js";
import EventDispatcher from "../../framework/managers/eventDispatcher.js";
import DefaultEventNames from "../../framework/utils/eventNames.js";

export default class DialogManager extends Singleton {
    constructor() {
        super("DialogManager");

        this.characters = new Map();
        this.currNode = null;
        this.nodeReader = new NodeReader();
        this.dispatcher = EventDispatcher.getInstance();
        this.dispatcher.add(DefaultEventNames.clearNodes, this, () => {
            console.log("hasdsa")
            this.currNode = null;
        }, true);
    }

    init() { }

    setCharacters(characters) {
        this.characters = characters;
    }

    setNode(node) {
        if (this.currNode == null && node != null) {
            this.currNode = node;
            this.currNode.processNode();
        }
        else {
            console.log(node)
        }
    }


    /**
    * @param {Phaser.Scene} scene - escena en la que se crea el nodo
    * @param {Object} fullJson - objeto json donde estan los nodos 
    * @param {String} namespace - nombre del archivo de localizacion del que se va a leer 
    * @param {String} objectName - nombre del objeto en el que esta el dialogo, si es que el json contiene varios dialogos de distintos objetos
    * @param {Boolean} getObjs - si se quiere devolver el nodo leido como un objeto 
    * @returns {DialogNode} - nodo raiz de los nodos leidos
    */
    readNodes(scene, file, namespace, objectName = "", getObjs = true) {
        return this.nodeReader.readNodes(scene, file, namespace, objectName, getObjs);
    }
}