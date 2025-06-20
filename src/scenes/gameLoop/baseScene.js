import GameManager from "../../managers/gameManager.js";
import DialogManager from "../../managers/dialogManager.js";
import Blackboard from "../../utils/blackboard.js";
import EventDispatcher from "../../managers/eventDispatcher.js";

export default class BaseScene extends Phaser.Scene {
    /**
    * Escena base para las escenas del juego. Guarda parametros como las dimensiones del canvas o los managers
    * @extends Phaser.Scene
    * @param {String} name - id de la escena
    * @param {String} atlasName - nombre del atlas que se utiliza en esta escena
    */
    constructor(name, atlasName) {
        super({ key: name });

        this.atlasName = atlasName;
    }

    create(params) {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.blackboard = new Blackboard();
        this.gameManager = GameManager.getInstance();
        this.dialogManager = DialogManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        this.bgScale = 1;

        // Funciones adicionales a las que se llamara al crear y reactivar la escena
        this.events.once("create", () => {
            this.onCreate(params);
        }, this);
        this.events.on("wake", (scene, params) => {
            this.onWake(params);
        }, this);
    }


    /**
    * Se llama al terminar de crear la escena. Se encarga de llamar initialSetup
    * @param {Object} params - objeto con los parametros que pasarle a initialSetup 
    */
    onCreate(params) {
        this.initialSetup(params);
    }

    /**
    * Se llama al despertar la escena. Se encarga de llamar initialSetup
    * @param {Object} params - objeto con los parametros que pasarle a initialSetup 
    */
    onWake(params) {
        this.initialSetup(params);
    }

    /**
    * Limpia los eventos del dispatcher
    */
    shutdown() {
        if (this.dispatcher != null) {
            this.dispatcher.removeAll();
        }
    }

    /**
    * Se encarga de configurar la escena con los parametros iniciales y
    * @param {Object} params - parametros que se le pasan a la configuracion inicial 
    */
    initialSetup(params) { }
}