import Singleton from "../utils/singleton.js";

export class EventHandler {
    /**
    * Clase que maneja la suscripcion y emisiones de eventos
    * @param {Phaser.Events.EventEmitter} emitter - emisor de eventos
    */
    constructor(emitter) {
        // Emisor de eventos
        this.emitter = emitter;

        /**
        * Mapa de eventos a suscriptores 
        * @type {Map<String, Set<Object>>}
        * Mapea un nombre de evento a los objetos que lo escuchan
        * Facilita la eliminación por nombre de evento
        */
        this.eventsMap = new Map();

        /**
        * Mapa de objetos a eventos y sus callbacks asociados 
        * @type {Map<Object, Map<String, Set<Function>>>}
        * Mapea un objeto a sus eventos y funciones asociadas
        * Facilita la eliminación de eventos por objeto o eliminar un evento especifico
        */
        this.objectsMap = new Map();
    }

    /**
    * Comprobar si un evento existe
    * @param {String} event - nombre del evento 
    * @param {Object} object - objeto suscrito al evento
    * @param {Function} callback - funcion que se ejecuta al producirse el evento
    * @param {Map} objectsMap - mapa de objetos en el que buscar el evento
    * @returns {Boolean} - si existe (true) o no (false)
    */
    has(event, object, callback) {
        // Si existe el objeto
        if (this.objectsMap.has(object)) {
            let eventsMap = this.objectsMap.get(object);
            // Si el objeto esta suscrito a ese evento
            if (eventsMap.has(event)) {
                let callbacksSet = eventsMap.get(event);
                // Si el evento tiene esa funcion asociada
                if (callbacksSet.has(callback)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
    * Guardar en evento
    * @param {String} event - nombre del evento 
    * @param {Object} object - objeto suscrito al evento
    * @param {Function} callback - funcion que se ejecuta al producirse el evento
    */
    add(event, object, callback) {
        // Si el evento no existe en el mapa de eventos, se crea el set de objetos
        if (!this.eventsMap.has(event)) {
            this.eventsMap.set(event, new Set());
        }
        let objectsSet = this.eventsMap.get(event);
        // Si el objeto no esta registrado para el evento, se registra
        if (!objectsSet.has(object)) {
            objectsSet.add(object);
        }

        // Si el objeto no existe
        if (!this.objectsMap.has(object)) {
            // Se crea el mapa de eventos
            this.objectsMap.set(object, new Map());
        }
        // Se obtiene el mapa de eventos
        let eventsMap = this.objectsMap.get(object);
        // Si no existe el set de funciones para ese evento
        if (!eventsMap.has(event)) {
            // Se crea el set de funciones
            eventsMap.set(event, new Set());
        }
        let callbacksSet = eventsMap.get(event);
        // Se anade la funcion
        callbacksSet.add(callback);
    }

    /**
    * Eliminar un callback especifico de un evento para un objeto
    * @param {String} event - nombre del evento 
    * @param {String} object - objeto suscrito al evento 
    * @param {Function} callback - funcion que se ejecuta al producirse el evento
    */
    remove(event, object, callback) {
        // Si existe el objeto
        if (this.objectsMap.has(object)) {
            let eventsMap = this.objectsMap.get(object);
            // Si existe el evento
            if (eventsMap.has(event)) {
                let callbacksSet = eventsMap.get(event);
                // Si existe el callback
                if (callbacksSet.has(callback)) {
                    // Se elimna el callback
                    callbacksSet.delete(callback);

                    // Se desuscribe
                    this.emitter.off(event, callback, object);
                }
            }
        }
    }

    /**
    * Eliminar un evento
    * @param {String} event - nombre del evento
    */
    removeByEvent(event) {
        // Si existe el evento
        if (this.eventsMap.has(event)) {
            let objectsSet = this.eventsMap.get(event);
            objectsSet.forEach(object => {
                // Se elimina el evento del mapa de objetos
                this.objectsMap.get(object).delete(event);
            });

            // Se desuscribe el evento
            this.emitter.off(event);

            // Se elimina el evento del mapa de eventos
            this.eventsMap.delete(event);
        }
    }

    /**
    * Eliminar todos los eventos suscritos a un objeto
    * @param {Object} object - objeto suscrito al evento
    */
    removeByObject(object) {
        // Si existe el objeto
        if (this.objectsMap.has(object)) {
            // Se obtienen todos los eventos
            let events = this.objectsMap.get(object);
            // Se recorre cada evento
            events.forEach((callbacksSet, eventName) => {
                // Se elimina en el mapa de eventos el objeto correspondiente 
                this.eventsMap.get(eventName).delete(object);

                // Se desuscribe el objeto de cada uno de sus callbacks
                callbacksSet.forEach(callback => {
                    this.emitter.off(eventName, callback, object);
                });
            });

            // Se elimina el objeto del mapa de objetos
            this.objectsMap.delete(object);
        }
    }

    /**
    * Eliminar todos los callbacks de un evento de un objeto
    * @param {String} event - nombre del evento
    * @param {Object} object - objeto suscrito al evento
    */
    removeAllCallbacks(event, object) {
        // Si existe el evento
        if (this.eventsMap.has(event)) {
            let objectsSet = this.eventsMap.get(event);
            // Si existe el objeto
            if (objectsSet.has(object)) {
                // Se elimina el objeto del evento correspondiente
                objectsSet.delete(object);

                // Se desuscriben todos los callbacks de ese evento para ese objeto
                let callbacksSet = this.objectsMap.get(object).get(event);
                callbacksSet.forEach(callback => {
                    this.emitter.off(event, callback, object);
                });

                // Se elimina el evento del mapa de objetos
                this.objectsMap.get(object).delete(event);
            }
        }
    }

    clear() {
        this.eventsMap.clear();
        this.objectsMap.clear();
    }

    /**
    * Eliminar todos los eventos 
    */
    removeAll() {
        this.eventsMap.forEach((objectsSet, eventName) => {
            this.emitter.off(eventName);
        });
        this.clear();
    }
}

export default class EventDispatcher extends Singleton {
    /**
    * Clase que centraliza la gestion de eventos entre objetos,
    * permitiendo que cualquier objeto emita o escuche eventos sin
    * necesidad de compartir contexto directo 
    */
    constructor() {
        super("EventDispatcher");

        // Emisor de eventos
        this.emitter = new Phaser.Events.EventEmitter();

        // Manejador de eventos temporales
        this.temporaryHandler = new EventHandler(this.emitter);
        // Manejador de eventos permanentes
        this.permanentHandler = new EventHandler(this.emitter);
    }

    /**
    * Emitir un evento
    * @param {String} event - nombre del evento
    * @param {Object} params - parametros del evento (opcional)
    */
    dispatch(event, params = {}) {
        this.emitter.emit(event, params);
    }

    /**
    * Suscribir un objeto a un evento
    * @param {String} event - nombre del evento
    * @param {Object} object - objeto suscrito al evento
    * @param {callback} callback - funcion que se ejecuta cuando se produce el evento
    * @param {Boolean} permanent - si la suscripcion es permanente (true) o temporal (false) (opcional)
    */
    add(event, object, callback, permanent = false) {
        if (!this.permanentHandler.has(event, object, callback)) {
            if (permanent) {
                if (this.temporaryHandler.has(event, object, callback)) {
                    this.temporaryHandler.remove(event, object, callback);
                }
                this.permanentHandler.add(event, object, callback);
                this.emitter.on(event, callback, object);
            }
            else {
                if (!this.temporaryHandler.has(event, object, callback)) {
                    this.temporaryHandler.add(event, object, callback);
                    this.emitter.on(event, callback, object);
                }
            }
        }
    }

    /**
    * Suscribir un objeto a un evento una sola vez
    * @param {String} event - nombre del evento
    * @param {Object} object - objeto suscrito al evento
    * @param {callback} callback - funcion que se ejecuta cuando se produce el evento
    */
    addOnce(event, object, callback) {
        this.emitter.once(event, callback, object);
    }

    /**
    * Eliminar un evento temporal 
    * @param {String} event - nombre del evento 
    * @param {String} object - objeto suscrito al evento 
    * @param {Function} callback - funcion que se ejecuta cuando se produce al evento
    */
    remove(event, object, callback) {
        this.temporaryHandler.remove(event, object, callback);
    }

    /**
    * Eliminar todas las suscripcione temporales a un evento
    * @param {String} event - nombre del evento
    */
    removeByEvent(event) {
        this.temporaryHandler.removeByEvent(event);
    }

    /**
    * Eliminar todos los eventos temporales de un objeto
    * @param {Object} object - objeto suscrito al evento
    */
    removeByObject(object) {
        this.temporaryHandler.removeByObject(object);
    }

    /**
    * Eliminar todas las funciones de un evento de un objeto
    * @param {String} event - nombre del evento
    * @param {Object} object - objeto suscrito al evento
    */
    removeAllCallbacks(event, object) {
        this.temporaryHandler.removeAllCallbacks(event, object);
    }

    /**
    * Eliminar todos los eventos temporales
    */
    removeAll() {
        this.temporaryHandler.removeAll();
    }

    /**
    * Eliminar tanto eventos temporales como permanentes 
    */
    shutdown() {
        this.emitter.shutdown();
        this.temporaryHandler.clear();
        this.permanentHandler.clear();
    }
}