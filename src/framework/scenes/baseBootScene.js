import SceneManager from "../managers/sceneManager.js";
import LocalizationManager from "../managers/localizationManager.js";
import EventDispatcher from "../managers/eventDispatcher.js";

export default class BaseBootScene extends Phaser.Scene {
    /**
    * Clase base para la escena inicial en la que se cargan todos los recursos
    * @extends Phaser.Scene
    */

    static REX_TEXT_TRANSLATION_PLUGIN_KEY = "rextexttranslationplugin";

    constructor(key = "BootScene") {
        super({
            key: key,
            // Se carga el plugin i18next
            pack: {
                files: [{
                    type: "plugin",
                    key: BaseBootScene.REX_TEXT_TRANSLATION_PLUGIN_KEY,
                    url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttranslationplugin.min.js",
                    start: true,
                    mapping: "translation"
                }]
            }
        });
    }

    /**
    * Inicializa las configuraciones basicas de la escena antes de cargar recursos
    */
    init() {
        this.CANVAS_WIDTH = this.sys.game.canvas.width;
        this.CANVAS_HEIGHT = this.sys.game.canvas.height;

        this.DEFAULT_LOADING_BAR_CONFIG = {
            x: this.CANVAS_WIDTH / 2,
            y: this.CANVAS_HEIGHT / 2,

            width: this.CANVAS_WIDTH / 2,
            height: 70,

            fillOffset: 20,
            bgColor: 0xbdbdbd,
            fillColor: 0x6e6e6e,
            borderColor: 0xFFFFFF,
            borderThickness: 2,
            radiusPercentage: 0.25,

            textOffset: 70,
        };

        this.DEFAULT_TEXT_CONFIG = {
            padding: 80,

            originX: 0.5,
            originY: 0.5,

            style: {
                fontSize: 30,
                fill: "#FFFFFF",
                fontStyle: "bold"
            }
        }

        this.LOCALIZATION_PATH = "assets/localization";
        this.i18nConfig = {
            defaultLanguage: "es",
            supportedLanguages: ["es"],
        }
    }

    /**
    * Aqui se deben cargar SOLO los assets para la PANTALLA DE CARGA
    */
    preload() { }

    /**
    * Aqui se deben cargar el resto de assets como imagenes, videos o los archivos de localizacion
    * 
    * IMPORTANTE: para configurar la barra de carga y los archivos de localizacion, es necesario modificar
    * los atributos de la clase corresopondiente antes de llamar a este metodo con super.create();
    * 
    * @param {Function} loadAssets - funcion con la carga del resto de assets
    * @param {Boolean} makeLoadingBar - true para mostrar la barra de carga al empezar, false en caso contrario
    */
    create(loadAssets = null, makeLoadingBar = true, dialogNamespaces = [], namespaces = []) {
        if (makeLoadingBar) {
            this.createLoadingBar();
        }
        this.loadi18next(dialogNamespaces, namespaces);
        this.loadDialogs(dialogNamespaces);
        if (loadAssets != null && typeof loadAssets == "function") {
            loadAssets();
        }

        let sceneManager = SceneManager.create();
        sceneManager.init(this);
        // sceneManager.fadeIn();

        let localizationManager = LocalizationManager.create();
        localizationManager.init(this.plugins.get(BaseBootScene.REX_TEXT_TRANSLATION_PLUGIN_KEY));

        let eventDispatcher = EventDispatcher.create();

        // Iniciar la carga de todos los assets en la cola
        // Nota: despues del preload, load.start() se llama automaticamente,
        // pero si cargas assets en otras partes hay que llamarlo manualmente
        this.load.start();

        // Al completar la carga, emitir el evento start para avisar que se puede continuar
        this.load.once("complete", () => {
            this.events.emit("start");

            sceneManager.runInParalell("UI");
        });
    }


    /**
    * Crea la barra de carga
    */
    createLoadingBar() {
        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();

        let x = this.DEFAULT_LOADING_BAR_CONFIG.x;
        let y = this.DEFAULT_LOADING_BAR_CONFIG.y;
        let width = this.DEFAULT_LOADING_BAR_CONFIG.width;
        let height = this.DEFAULT_LOADING_BAR_CONFIG.height;
        let fillOffset = this.DEFAULT_LOADING_BAR_CONFIG.fillOffset;
        let radius = Math.min(width, height) * this.DEFAULT_LOADING_BAR_CONFIG.radiusPercentage;

        progressBox.fillStyle(this.DEFAULT_LOADING_BAR_CONFIG.bgColor, 1).fillRoundedRect(x - width / 2, y - height / 2, width, height, radius)
            .lineStyle(this.DEFAULT_LOADING_BAR_CONFIG.borderThickness, this.DEFAULT_LOADING_BAR_CONFIG.borderCol, 1)
            .strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius)


        // Se va actualizando la barra de progreso y el texto con el porcentaje
        this.load.on("progress", (value) => {
            if (value > 0) {
                percentText.setText(parseInt(value * 100) + "%");
                progressBar.clear();
                progressBar.fillStyle(this.DEFAULT_LOADING_BAR_CONFIG.fillColor, 1);
                progressBar.fillRoundedRect(x - (width - fillOffset) / 2, y - (height - fillOffset) / 2, (width - fillOffset) * value, height - fillOffset, radius);
            }
        });


        let style = this.DEFAULT_TEXT_CONFIG.style;
        let originX = this.DEFAULT_TEXT_CONFIG.originX;
        let originY = this.DEFAULT_TEXT_CONFIG.originY;
        let textPadding = this.DEFAULT_TEXT_CONFIG.padding;

        let percentText = this.add.text(x, y, "=%", style).setOrigin(originX, originY);
        let loadingText = this.add.text(x, y - textPadding, "Loading...", style).setOrigin(originX, originY);
        let assetText = this.add.text(x, y + textPadding, "", style).setOrigin(originX, originY);

        // Cuando carga un archivo, muestra el nombre del archivo debajo de la barra
        this.load.on("fileprogress", function (file) {
            // console.log(file.key);
            assetText.setText("Loading asset: " + file.key);
        });
    }


    /**
    * Se cargan los estructura de los dialogos a partir de los archivos JSON
    */
    loadDialogs(dialogNamespaces) {
        // Ruta basa para la estructura de los archivos de dialogos
        this.load.setPath(this.LOCALIZATION_PATH + "/structure");

        dialogNamespaces.forEach((dialogPath) => {
            // Se obtiene el nombre del archivo (ultima parte del path)
            let pathSegments = dialogPath.split("/");
            let filename = pathSegments[pathSegments.length - 1];

            // Ruta completa del archivo JSON dentro del directorio structure
            let jsonFilePath = dialogPath + ".json";
            this.load.json(filename, jsonFilePath);
        });
    }

    /**
    * Se inicializa y configura el plugin de i18next para la internacionalizacion 
    */
    loadi18next(dialogNamespaces, namespaces) {
        // Se unen todos los namespaces que se usaran
        let allNamespaces = dialogNamespaces.concat(namespaces);

        // Convertir "/" a "\\" para rutas en i18next (requisito del plugin)
        allNamespaces.forEach((namespace, index) => {
            allNamespaces[index] = namespace.replace(/\//g, "\\");
        });

        /*
     * i18next es un framework ampliamente utilizado para internacionalizacion en Javascript.
     * Mas informacion y descarga:
     *   - Pagina del plugin para Phaser3: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/i18next/
     *   - Documentacion oficial: https://www.i18next.com/
     */

        // Se inicializa el plugin de traduccion con la configuracion especificada
        this.plugins.get(BaseBootScene.REX_TEXT_TRANSLATION_PLUGIN_KEY).initI18Next(this, {
            // Idioma inicial por defecto
            lng: this.i18nConfig.defaultLanguage,
            // Idioma de resplado
            fallbackLng: this.i18nConfig.defaultLanguage,
            // Lista de idiomas soportados
            supportedLngs: this.i18nConfig.supportedLanguages,
            // Se precargan todos los idiomas soportados. En caso contrario, al usar un idioma por
            // primera vez, este no ha cargado todavia y se usa el por defecto
            preload: this.i18nConfig.supportedLanguages,
            // Namespaces a cargar (archivos de traduccion)
            ns: allNamespaces,
            // Modo debug (logs por consola)
            debug: this.sys.game.debug.enable,
            // Ruta base para cargar los archivos de traduccion en formato JSON
            backend: {
                // {{lng}} --> nombre de las carpetas de idiomas
                // {{ns}} --> nombre de los archivos JSON namespaces
                loadPath: this.LOCALIZATION_PATH + "/{{lng}}/{{ns}}.json"
            }
        })
    }
}