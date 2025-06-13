import Singleton from "../utils/singleton.js";

export default class SceneManager extends Singleton {

    constructor(scene) {
        super("SceneManager");

        this.currentScene = scene;
        this.runningScenes = new Set();
        this.fading = false;

        this.DEFAULT_FADE_OUT_TIME = 200;
        this.DEFAULT_FADE_IN_TIME = 200;
    }

    /**
    * Metodo para borrar y cerrar todas las escenas activas
    */
    clearRunningScenes() {
        this.runningScenes.forEach(sc => {
            // Si la escena es hija de BaseScene, se tiene que llamar a su shutdown 
            // antes de detener la escena para evitar problemas al borrar los retratos
            if (sc.shutdown != null && typeof sc.shutdown === "function") {
                sc.shutdown();
            }
            sc.scene.stop(sc);
        });
        this.runningScenes.clear();
    }

    /**
    * Metodo para cambiar de escena
    * @param {String} scene - key de la escena a la que se va a pasar
    * @param {Object} params - informacion que pasar a la escena (opcional)
    * @param {Boolean} cantReturn - true si se puede regresar a la escena anterior, false en caso contrario
    */
    changeScene(scene, params, anim = false, canReturn = false) {
        // Reproduce un fade out al cambiar de escena
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

            this.fadeOut(fadeOutTime);
        }

        let change = (cam, effect) => {
            // Si no se puede volver a la escena anterior, se detienen todas las
            // escenas que ya estaban creadas porque ya no van a hacer falta 
            if (!canReturn) {
                this.clearRunningScenes();
            }
            // Si no, se se duerme la escena actual en vez de destruirla ya que
            // habria que mantener su estado por si se quiere volver a ella
            else {
                this.currentScene.scene.sleep();
            }

            // Se inicia y actualiza la escena actual
            this.currentScene.scene.run(scene, params);
            this.currentScene = this.currentScene.scene.get(scene);

            // Se anade la escena a las escenas que estan ejecutandose
            this.runningScenes.add(this.currentScene);

            if (anim) {
                // Cuando se termina de crear la escena, se reproduce el fade in
                this.currentScene.events.on("create", () => {
                    this.fadeIn(fadeInTime);
                });
                this.currentScene.events.on("wake", () => {
                    this.fadeIn(fadeInTime);
                });
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

    
    fadeOut(time) {
        this.currentScene.cameras.main.fadeOut(time, 0, 0, 0);
        this.fading = true;
    }

    fadeIn(time) {
        this.currentScene.cameras.main.fadeIn(time, 0, 0, 0);
        this.fading = true;
        this.currentScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            this.fading = false;
        });
    }
}
