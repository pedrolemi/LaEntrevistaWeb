
let instance = null;

export default class Singleton { 
    constructor(className) {
        if (instance === null) {
            instance = this;
        }
        else {
            console.warn(className,"is a Singleton class!");
        }
    }

    static create() {
        if (instance === null) {
            instance = new Singleton();
        }
        return instance;
    }

    static getInstance() {
        return this.create();
    }   
}
