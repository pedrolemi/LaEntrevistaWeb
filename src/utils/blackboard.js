export default class Blackboard {
    constructor() {
        this.blackboard = new Map();
    }

    /**
    * Devuelve el valor buscado en la blackboard
    * @param {String} key - valor buscado
    * @returns {object} - el objeto buscado en caso de que exista. null en caso contrario
    */
    getValue(key) {
        if (this.blackboard.has(key)) {
            return this.blackboard.get(key);
        }
        return null;
    }

    /**
    * Metodo que setea un valor en la blackboard
    * @param {String} key - valor que se va a cambiar
    * @param {Object} value - valor que se le va a poner al valor a cambiar
    * @returns {boolean} - true si se ha sobrescrito un valor. false en caso contrario
    */
    setValue(key, value) {
        let exists = false;
        if (this.blackboard.has(key)) {
            exists = true;
        }
        this.blackboard.set(key, value);
        return exists;
    }

    /**
    * Indica si un valor existe o no en la blackboard
    * @param {String} key - valor buscado
    * @returns {boolean} - true si existe el valor. false en caso contrario
    */
    hasValue(key) {
        return this.blackboard.has(key);
    }
}