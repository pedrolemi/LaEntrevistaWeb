export default class Singleton {
    /**
    * Clase base para los singletons 
    * @extends Phaser.Scene
    * @param {String} className - nombre de la clase. Se usa solo para el mensaje de la constructora
    */
    constructor(className = "Singleton") {
        if (this.constructor.instance === undefined) {
            this.constructor.instance = this;
        }
        else {
            console.warn(className, "is a Singleton class!");
        }
        return this.constructor.instance;
    }

    /**
    * Crear y obtener la instancia
    * @returns {Singleton} - instancia unica de la clase
    */
    static create() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    /**
    * Obtener la instancia
    * @returns {Singleton} - instancia unica de la clase
    */
    static getInstance() {
        return this.create();
    }
}