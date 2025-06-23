export default class Blackboard extends Map {
    /**
    * Devuelve el valor buscado en la blackboard
    * @param {String} key - valor buscado
    * @returns {object} - el objeto buscado en caso de que exista. null en caso contrario
    */
    getValue(key) {
        if (super.has(key)) {
            return super.get(key);
        }
        return null;
    }

    /**
    * Establece un valor en la blackboard
    * @param {String} key - valor que se va a cambiar
    * @param {Object} value - valor que se le va a poner al valor a cambiar
    * @returns {boolean} - true si se ha sobrescrito un valor. false en caso contrario
    */
    setValue(key, value) {
        let exists = false;
        if (super.has(key)) {
            exists = true;
        }
        super.set(key, value);
        return exists;
    }

    /**
    * Indica si un valor existe o no en la blackboard
    * @param {String} key - valor buscado
    * @returns {boolean} - true si existe el valor. false en caso contrario
    */
    hasValue(key) {
        return super.has(key);
    }
}