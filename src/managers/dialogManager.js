import Localization from "../dialog/baseClasses/localization.js";
import Singleton from "../utils/singleton.js";

export default class DialogManager extends Singleton {
    constructor() {
        super("DialogManager");

        this.scene = null;
        this.textbox = null;
        this.currNode = null;
        this.characters = new Map();
    }

    init(scene, nodeReader) {
        this.scene = scene;
        this.localization = new Localization(this.scene.plugins.get("rextexttranslationplugin"));
        this.nodeReader = nodeReader;
    }

    setCharacters(characters) {
        this.characters = characters;
    }

    setNode(node) {
        if (this.currNode == null) {
            node.processNode();
        }
    }

    /**
    * @param {String} fullId - nombre del elemento a traducir dentro del namespace 
    * @param {String} namespace - nombre del archivo (namespace) en el que esta el texto a traducir
    * @param {Boolean} returnObjects - true para que i18next devuelva los objetos que lee al localizar, false en caso contrario (opcional)
    * @returns {String} - texto traducido
    */
    translate(fullId, namespace, returnObjects = true) {
        return this.localization.translate(fullId, { ns: namespace, returnObjects: returnObjects });
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

    /**
    * Reproduce la animacion hablando del personaje.
    * Si no existe dicha animacion, reproduce la animacion por defecto
    * @param {String} character - nombre del personaje.
    */
    playTalkingAnimation(character) {
        if (this.characters.has(character)) {
            let characterObj = this.scene.dialogManager.characters.get(character);
            if (!characterObj.playTalkingAnimation()) {
                characterObj.playDefaultAnimation();
            }
        }
    }

    /**
    * Reproduce la animacion por defecto del personaje
    * @param {String} character - nombre del personaje.
    */
    playDefaultAnimation(character) {
        if (this.characters.has(character)) {
            let characterObj = this.scene.dialogManager.characters.get(character);
            characterObj.playDefaultAnimation();
        }
    }
}