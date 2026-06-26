import TrackerManager from "./managers/trackerManager.js";

export default class GameStage {
    /**
    * Representa una etapa del juego que pueder ser completada
    * @param {string} id - identificador de la etapa 
    * @param {number} totalSteps - numero total de pasos para completar la etapa
    */
    constructor(id, totalSteps) {
        let trackerManager = TrackerManager.getInstance();
        // Crea un objeto Completable usando el tracker para trackear el objeto
        this.completable = trackerManager.createGameStageCompletable(id);

        this.initialized = false;
        this.completedSteps = 0;
        this.totalSteps = totalSteps;
    }

    initialize() {
        this.reset();

        this.completable.initialize();
    }

    /**
    * Actualiza el progreso de la etapa
    * @param {number} errors - numero de errores que han ocurrido en la etapa (opcional)
    * @param {object} extensions - informacion adicional que enviar al evento
    */
    progress(errors = null, extensions = {}) {
        if (this.initialized) {
            ++this.completedSteps;

            if (errors !== null) {
                extensions["errors"] = errors;
            }

            this.completable.progress(this.completedSteps, this.totalSteps, extensions);
        }
    }

    hasCompleted() {
        return this.completedSteps >= this.totalSteps;
    }

    complete(success, completion) {
        if (this.initialized) {
            this.completable.complete(success, completion, this.completedSteps, this.totalSteps);
        }
    }

    reset() {
        this.initialized = true;
        this.completedSteps = 0;
    }
}