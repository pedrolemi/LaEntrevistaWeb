import Singleton from "../utils/singleton.js";

export default class EventDispatcher extends Singleton {
    /**
    * Clase para tratar los mensajes sin tener en cuenta el ambito.
    * De este modo cualquier objeto puede emitir un mensaje y otro que se 
    * encuentre en otro lugar distinto puede suscribirse sin preocuparse del ambito
    */
    constructor() {
        super("EventDispatcher");

        // Emisor de eventos
        this.emitter = new Phaser.Events.EventEmitter();


        // Mapas para conseguir un mejor manejo de los eventos y poder eliminar los eventos segun propietario

        // EVENTOS TEMPORALES
        // Se usa para poder borrar por evento facilmente
        // Estructura: evento-propietario -> map<string, set<object>>
        this.eventsMap = new Map();
        // Se usa para poder borrar por propietario facilmente
        // Estructura: propietario-evento-funciones -> map<object, map<string, set<fn>>>
        this.ownersMap = new Map();

        // EVENTOS PERMANENTES
        // Guardar eventos permanentemente
        // Estructura: propietario-evento-funciones -> map<object, map<string, set<fn>>>
        this.ownersPermanentMap = new Map();
    }


    /**
    * Emitir un evento
    * @param {String} event - nombre del evento
    * @param {Object} obj - objeto que reciben los objetos suscritos al evento (opcional)
    */
    dispatch(event, obj) {
        this.emitter.emit(event, obj);
    }

    /**
    * Comprobar si un evento TEMPORAL o PERMANENTE ya existe
    * @param {String} event - nombre del evento 
    * @param {Object} owner - objeto que se suscribe al evento
    * @param {Function} fn - funcion que se ejecuta al producirse el evento
    * @param {Map} ownersMap - mapa de propietarios en el que buscar el evento (TEMPORAL O PERMANENTE)
    */
    alreadyExists(event, owner, fn, ownersMap) {
        // Existe el propietario...
        if (ownersMap.has(owner)) {
            // El propietario esta suscrito a ese evento...
            let ownerAux = ownersMap.get(owner);
            if (ownerAux.has(event)) {
                // El propietario tiene esa funcion suscrita a ese evento...
                let eventAux = ownerAux.get(event);
                if (eventAux.has(fn)) {
                    // Entonces, ya existe esa suscripcion
                    return true;
                }
            }
        }
        return false;
    }


    /**
    * PUBLICO
    * Suscribir un objeto a un evento TEMPORAL o PERMANENTE
    * @param {String} event - nombre del evento
    * @param {Object} owner - objeto que se suscribe al evento (contexto/scope)
    * @param {Fn} fn - funcion que se ejecuta cuando se produce el evento
    * @param {Boolean} permanent - indica si la suscripcion es permanente (true) o temporal (false)
    */
    add(event, owner, fn, permanent) {
        let exists = false;

        // Si no existe como permanente...
        exists = this.alreadyExists(event, owner, fn, this.ownersPermanentMap);
        if (!exists) {
            // Se quiere anadir como permanente...
            if (permanent) {
                // Se anade como permanente
                // exists -> false
                this.addAsPermanent(event, owner, fn);

                // Si existia como temporal...
                if (this.alreadyExists(event, owner, fn, this.ownersMap)) {
                    // Se elimina porque ahora es permanente
                    this.deepRemove(event, owner, fn);
                }
            }
            // Se quiere anadir como temporal...
            else {
                // Si no existe como temporal...
                exists = this.alreadyExists(event, owner, fn, this.ownersMap);
                if (!exists) {
                    // Se anade como temporal
                    // exists -> false
                    this.addAsTemporary(event, owner, fn);
                }
            }
        }

        // Si no existe, se emite...
        if (!exists) {
            // Nota: aunque se ha tratado en la propia clase, EventEmitter hace que si ya se esta suscrito
            // al evento, no se vuelve a suscribir
            this.emitter.on(event, fn, owner);
        }
    }

    /**
    * Almacenar en los mapas un evento TEMPORAL
    * @param {String} event - nombre del evento 
    * @param {Object} owner - objeto que se suscribe al evento
    * @param {Function} fn - funcion que se ejecuta al producirse el evento
    */
    addAsTemporary(event, owner, fn) {
        // EVENTOS
        if (!this.eventsMap.has(event)) {
            // El evento no existe...
            // Se crea el evento en el mapa de eventos
            this.eventsMap.set(event, new Set());
        }
        let eventAux = this.eventsMap.get(event);
        if (!eventAux.has(owner)) {
            // El evento no tiene registrado a ese propietario...
            // Se anade ese propietario al evento en el mapa de eventos
            eventAux.add(owner);
        }

        // PROPIETARIOS
        this.addToOwnersMap(event, owner, fn, this.ownersMap);
    }

    /**
    * Almacenar en los mapas un evento PERMANENTE
    * @param {String} event - nombre del evento 
    * @param {Object} owner - objeto que se suscribe al evento
    * @param {Function} fn - funcion que se ejecuta al producirse el evento
    */
    addAsPermanent(event, owner, fn) {
        this.addToOwnersMap(event, owner, fn, this.ownersPermanentMap);
    }

    /**
    * Almacenar un evento en el mapa de propietarios
    * @param {String} event - nombre del evento 
    * @param {Object} owner - objeto que se suscribe al evento
    * @param {Function} fn - funcion que se ejecuta al producirse el evento
    * @param {Map} ownersMap - mapa de propietarios en el que se va a guardar el evento
    */
    addToOwnersMap(event, owner, fn, ownersMap) {
        // PROPIETARIOS
        if (!ownersMap.has(owner)) {
            // El propietario no existe...
            // Se crea el propietario en el mapa de propietarios correspondiente
            ownersMap.set(owner, new Map());
        }
        let ownerAux = ownersMap.get(owner);
        if (!ownerAux.has(event)) {
            // El propietario no esta suscrito a ese evento...
            // Se crea el evento para ese propietario en el mapa de propietarios correspondiente
            ownerAux.set(event, new Set());
        }
        let ownerEventAux = ownerAux.get(event);
        // Se anade la funcion de ese evento para ese propietario en el mapa de propietarios correspondiente
        // Nota: si se ha llegado a este punto esta funcion no esta registrada porque si lo estuviera habria salido que ya existe esa suscripcion
        ownerEventAux.add(fn);
    }

    /**
    * PUBLICO
    * Suscribir un objeto a un evento una sola vez
    * @param {String} event - nombre del evento
    * @param {Object} owner - objeto que se suscribe al event (contexto)
    * @param {Fn} fn - funcion que se ejecuta cuando se produce el evento
    */
    addOnce(event, owner, fn) {
        this.emitter.once(event, fn, owner);
    }

    /**
    * PUBLICO
    * @param {String} event - nombre del evento 
    * @param {String} owner - objeto suscrito al evento 
    * @param {Function} fn - funcion que ejecuta al producirse el evento
    */
    deepRemove(event, owner, fn) {
        // Si existe el propietario... 
        if (this.ownersMap.has(owner)) {
            let ownersAux = this.ownersMap.get(owner);
            // Si existe el evento...
            if (ownersAux.has(event)) {
                let ownerEventAux = ownersAux.get(event);
                // Si existe la funcion...
                if (ownerEventAux.has(fn)) {
                    // Se desuscribe la funcion del evento que corresponde a cierto propietario
                    ownerEventAux.delete(fn);

                    this.emitter.off(event, fn, owner);
                }
            }
        }
    }

    /**
    * PUBLICO
    * Desuscribir a todos los objetos de un evento concreto TEMPORAL
    * @param {String} event - nombre del evento
    */
    removeByEvent(event) {
        // Existe el evento...
        if (this.eventsMap.has(event)) {
            let owners = this.eventsMap.get(event);
            // Se actualiza el mapa de propietarios
            owners.forEach(owner => {
                this.ownersMap.get(owner).delete(event);
            });

            // Se elimina el evento
            this.emitter.off(event);

            // Se actualiza el mapa de eventos
            this.eventsMap.delete(event);
        }
    }

    /**
    * PUBLICO
    * Desuscribir a un objeto de todos sus eventos TEMPORALES
    * @param {Object} owner - objeto suscrito al evento
    */
    removeByOwner(owner) {
        // Si existe el propietario...
        if (this.ownersMap.has(owner)) {
            // Se obtienen todos los eventos del propietario (map)
            let events = this.ownersMap.get(owner);
            // Se recorre cada evento
            events.forEach((functions, eventName) => {
                // Se elimina el propietario de ese evento en el mapa de eventos
                this.eventsMap.get(eventName).delete(owner);

                // Se desuscribe el propietario de cada evento por cada funcion que tenga suscrita
                // (no es lo habitual, pero podria darse el caso que un
                // mismo propietario estuviera suscrito a un mismo evento con varias funciones)
                functions.forEach(fn => {
                    this.emitter.off(eventName, fn, owner);
                });
            });

            // Se actualiza el mapa de propietarios
            this.ownersMap.delete(owner);
        }
    }

    /**
    * PUBLICO
    * Desuscribir a un objeto de un evento concreto TEMPORAL
    * @param {String} event - nombre del evento
    * @param {Object} owner - objeto suscrito al evento
    */
    remove(event, owner) {
        // Existe el evento...
        if (this.eventsMap.has(event)) {
            // Existe el propietario...
            let eventAux = this.eventsMap.get(event);
            if (eventAux.has(owner)) {
                // Se actualiza el mapa de eventos
                eventAux.delete(owner);

                // Se desuscriben todas las funciones del propietarios que estan suscritas a ese evento
                // (a partir del mapa de propietarios)
                let ownerEventAux = this.ownersMap.get(owner).get(event);
                ownerEventAux.forEach(fn => {
                    this.emitter.off(event, fn, owner);
                });

                // Se actualiza el mapa de propietarios
                this.ownersMap.get(owner).delete(event);
            }
        }
    }

    /**
    * Eliminar todos los eventos TEMPORALES
    * Nota: si no hay comunicacion entre escenas, es recomendable 
    * llamarlo por cada cambio de escenas para mejorar el rendimiento
    */
    removeAll() {
        this.emitter.shutdown();
        this.eventsMap.clear();
        this.ownersMap.clear();

        // Se recorre el mapa permanente de propietarios...
        this.ownersPermanentMap.forEach((events, owner) => {
            // Se recorren los eventos de ese propietario...
            events.forEach((functions, eventName) => {
                // Se recorre cada una de las funciones de ese evento...
                functions.forEach((fn) => {
                    // SE VUELVE A SUSCRIBIR PORQUE SON PERMANENTES
                    this.emitter.on(eventName, fn, owner);
                });
            });
        });
    }

    /**
    * Limpiar por completo el emisor, por lo tanto, se eliminan tanto eventos TEMPORALES como PERMANENTES
    */
    clear() {
        this.emitter.shutdown();
        this.eventsMap.clear();
        this.ownersMap.clear();
        this.ownersPermanentMap.clear();
    }
}