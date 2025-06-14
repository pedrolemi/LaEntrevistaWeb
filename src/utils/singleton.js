/**
* Clase base para los singletons 
* @extends Phaser.Scene
* @param {String} className - nombre de la clase. Se usa solo para el mensaje de la constructora
*/
export default class Singleton { 
    constructor(className = "Singleton") {
        if (this.constructor.instance === undefined) {
            this.constructor.instance = this;
        }
        else {
            console.warn(className,"is a Singleton class!");
        }
        return this.constructor.instance;
    }

    /**
    * Metodo para crear y obtener la instancia
    * @returns {Singleton} - instancia unica de la clase
    */
    static create() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    /**
    * Metodo para obtener la instancia
    * @returns {Singleton} - instancia unica de la clase
    */
    static getInstance() {
        return this.create();
    }   
}