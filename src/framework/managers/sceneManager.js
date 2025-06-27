import Singleton from "../utils/singleton.js";

export default class SceneManager extends Singleton {
    /**
    * Gestiona los cambios de escena y la vida de las mismas para
    * no tener que acceder directamente al ScenePlugin de Phaser
    */
    constructor() {
        super("SceneManager");

        this.currentScene = null;
        this.runningScenes = new Set();
        this.fading = false;

        this.DEFAULT_FADE_OUT_TIME = 200;
        this.DEFAULT_FADE_IN_TIME = 200;
    }

    init(scene) {
        this.currentScene = scene;
        this.runningScenes.add(this.currentScene);
    }

    /**
    * Obtener una escena por su key
    * @param {String} sceneKey - key de la escena que se quiere obtener
    * @returns {Phaser.Scene} escena con la key indicada
    */
    getScene(sceneKey) {
        return this.currentScene.scene.get(sceneKey);
    }

    /**
    * Ejecutar una escena en paralelo al resto
    * 
    * NO SE GUARDA EN LAS ESCENAS ACTUALES, POR LO QUE PARA GESTIONARLA 
    * HACE FALTA HACER UN GET PRIMERO Y LUEGO HACER LO QUE SEA CON ELLA
    * 
    * @param {String} sceneKey - key de la escena a ejecutar en paralelo
    */
    runInParalell(sceneKey) {
        this.currentScene.scene.launch(sceneKey);
    }

    /**
    * Reiniciar la escena indicada
    * @param {String} sceneKey - key de la escena a reiniciar
    */
    restartScene(sceneKey) {
        let sc = this.currentScene.scene.get(sceneKey);
        sc.scene.restart();
    }

     /**
    * Detener la escena indicada
    * @param {String} sceneKey - key de la escena a detener
    */
    stopScene(sceneKey) {
        let sc = this.currentScene.scene.get(sceneKey);
        sc.scene.stop(sc);
    }

    /**
    * Cambiar de escena
    * @param {String} sceneKey - key de la escena a la que se va a pasar
    * @param {Object} params - informacion que pasar a la escena (opcional)
    * @param {Boolean} anim - true si se va a cambiar de escena con un fade in/out, false en caso contrario (oocional)
    * @param {Boolean} canReturn - true si se puede regresar a la escena anterior, false en caso contrario (opcional)
    */
    changeScene(sceneKey, params = null, anim = false, canReturn = false) {
        if (this.fading) {
            return;
        }

        this.fading = false;
        let fadeOutTime = this.DEFAULT_FADE_OUT_TIME;
        let fadeInTime = this.DEFAULT_FADE_IN_TIME;

        if (anim) {
            if (params != null) {
                if (params.fadeOutTime != null) {
                    fadeOutTime = params.fadeOutTime;
                }
                if (params.fadeInTime != null) {
                    fadeInTime = params.fadeInTime;
                }
            }

            // Reproduce un fade out al cambiar de escena
            this.fadeOut(fadeOutTime);
        }

        let change = (cam, effect) => {
            // Si se puede regresar a la escena de la que se viene, se duerme 
            // para mantener su estado por si se quiere volver a ella
            if (canReturn) {
                // Dormir la escena actual
                this.currentScene.scene.sleep();
            }

            // Se ejecuta la escena (sin reiniciarla si ya existia o creandola de 0 si no existia)
            this.currentScene.scene.run(sceneKey, params);
            this.currentScene = this.currentScene.scene.get(sceneKey);

            // Si no se puede volver a la escena anterior, se detienen todas las
            // escenas que ya estaban creadas porque ya no van a hacer falta (a
            // excepcion de la escena actual, por si se cambia a una escena a la
            // que se podia regresar desde una escena a la que no se podra regresar)
            if (!canReturn) {
                this.clearRunningScenes();
            }

            // Se guarda la escena a las escenas que estan ejecutandose
            this.runningScenes.add(this.currentScene);

            
            if (anim) {
                let fadeIn = () => {
                    this.fadeIn(fadeInTime);
                }
                // Cuando se termina de crear la escena, se reproduce el fade in
                this.currentScene.events.on("create", fadeIn);
                this.currentScene.events.on("wake", fadeIn);
            }
        }
        if (anim) {
            // Cuando acaba el fade out de la escena actual se cambia a la siguiente
            this.currentScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                change(cam, effect);
            });
        }
        else {
            change(null, null);
        }
    }


    /**
    * Detener y borrar todas las escenas activas
    */
    clearRunningScenes() {
        this.runningScenes.forEach(sc => {
            if (sc != this.currentScene) {
                // Si la escena tiene el metodo shutdown, se llama a su shutdown antes de detenerla 
                if (sc.shutdown != null && typeof sc.shutdown === "function") {
                    sc.shutdown();
                }
                this.stopScene(sc);
            }
        });
        this.runningScenes.clear();
    }


    /**
    * Hacer solo fade out
    * @param {Number} time - tiempo en milisegundos que dura la animacion (opcional)
    */
    fadeOut(time = this.DEFAULT_FADE_OUT_TIME) {
        this.currentScene.cameras.main.fadeOut(time, 0, 0, 0);
        this.fading = true;
    }

    /**
    * Hacer solo fade in
    * @param {Number} time - tiempo en milisegundos que dura la animacion (opcional)
    */
    fadeIn(time = this.DEFAULT_FADE_IN_TIME) {
        this.currentScene.cameras.main.fadeIn(time, 0, 0, 0);
        this.fading = true;
        this.currentScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            this.fading = false;
        });
    }
}
