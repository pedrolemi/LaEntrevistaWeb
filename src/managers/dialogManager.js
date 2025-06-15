import Localization from "../dialog/localization.js";
import NodeReader from "../dialog/nodeReader.js";
import Singleton from "../utils/singleton.js";

export default class DialogManager extends Singleton {
    constructor() {
        super("DialogManager");

        this.i18n = null;
    }

    init(i18n) {
        this.localization = new Localization(i18n);
        this.nodeReader = new NodeReader(this.localization);
    }

    /**
    * @param {String} translationId - nombre del elemento a traducir dentro del namespace 
    * @param {String} namespace - nombre del archivo (namespace) en el que esta el texto a traducir
    * @param {Boolean} returnObjects - true para que i18next devuelva los objetos que lee al localizar, false en caso contrario (opcional)
    * @returns {String} - texto traducido
    */
    translate(translationId, namespace, returnObjects = false) {
        return this.localization.translate(translationId, { ns: namespace, returnObjects: returnObjects });
    }

    /**
    * 
    * @param {*} file 
    * @param {*} namespace 
    * @param {*} objectName 
    * @param {*} getObjs 
    * @returns 
    */
    readNodes(scene, file, namespace, objectName = "", getObjs = true) { 
        return this.nodeReader.readNodes(scene, file, namespace, objectName, getObjs);
    }
}