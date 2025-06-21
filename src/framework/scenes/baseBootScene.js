import SceneManager from "../managers/sceneManager.js";
import DialogManager from "../managers/dialogManager.js";
import NodeReader from "../dialog/nodeReader.js";
import LocalizationManager from "../managers/localizationManager.js";
import EventDispatcher from "../managers/eventDispatcher.js";

export default class BaseBootScene extends Phaser.Scene {
    /**
    * Clase base para la escena inicial en la que se cargan todos los recursos
    * @extends Phaser.Scene
    */
    constructor(key = "BootScene") {
        super({
            key: key,
            // Se carga el plugin i18next
            pack: {
                files: [{
                    type: "plugin",
                    key: "rextexttranslationplugin",
                    url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttranslationplugin.min.js",
                    start: true,
                    mapping: "translation"
                }]
            }
        });
    }

    /**
    * Aqui se deben cargar SOLO los assets para la PANTALLA DE CARGA
    * Tambien se usa para crear la configuracion por defecto de la pantalla
    */
    preload() {
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


        this.localizationPath = "assets/localization";
        this.i18nConfig = {
            defaultLanguage: "es",
            supportedLanguages: ["es"],
            debug: false
        }
        this.dialogsAndNamespaces = [];
        this.onlyNamespaces = [];
    }


    /**
    * Aqui se deben cargar el resto de assets como imagenes, videos o los archivos de localizacion
    * 
    * IMPORTANTE: para configurar la barra de carga y los archivos de localizacion, es necesario modificar
    * los atributos de la clase correspondientes antes de llamar a este metodo con super.create();
    * 
    * @param {Function} loadAssets - funcion con la carga del resto de assets
    * @param {Boolean} makeLoadingBar - true para mostrar la barra de carga al empezar, false en caso contrario
    */
    create(loadAssets = () => { }, makeLoadingBar = true) {
        if (makeLoadingBar) {
            this.createLoadingBar();
        }
        this.loadi18next();
        this.loadDialogs();
        loadAssets();

        let sceneManager = SceneManager.create();
        sceneManager.init(this);
        // sceneManager.fadeIn();

        let dialogManager = DialogManager.create();
        dialogManager.init(this, new NodeReader());

        let localizationManager = LocalizationManager.create();
        localizationManager.init(this);

        let eventDispatcher = EventDispatcher.create();

        // Indicar a LoaderPlugin que hay que cargar los assets que se encuentran en la cola
        // Nota: despues del preload este metodo se llama automaticamente, pero si se quieren
        // cargar assets en otra parte hay que llamarlo manualmente
        this.load.start();

        this.load.once("complete", () => {
            this.events.emit("start");
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
    * Carga los jsons de los dialogos
    */
    loadDialogs() {
        // Archivos de dialogos (estructura)
        this.load.setPath(this.localizationPath + "/structure");

        this.dialogsAndNamespaces.forEach((dialog) => {
            // Quedarse con la ultima parte del path, que corresponde con el id del archivo
            let subPaths = dialog.split("/");
            let name = subPaths[subPaths.length - 1];
            // Ruta completa (dentro de la carpeta structure y con el extension .json)
            let wholePath = dialog + ".json";
            this.load.json(name, wholePath);
        });
    }

    /**
    * Carga y configura el plugin de i18n
    */
    loadi18next() {
        let namespaces = this.dialogsAndNamespaces.concat(this.onlyNamespaces);

        for (let i = 0; i < namespaces.length; ++i) {
            // IMPORTANTE: EN EL PLUGIN I18NEXT PARA LAS RUTAS HAY QUE USAR "\\" EN VEZ DE "/"
            namespaces[i] = namespaces[i].replace(/\//g, "\\");
        }

        // i18next es un framework de internalizacion ampiamente usado en javascript
        // PAGINA DONDE DESCARGARLO -> https://rexrainbow.github.io/phaser3-rex-notes/docs/site/i18next/
        // DOCUMENTACION OFICIAL -> https://www.i18next.com/

        // Se inicializa el plugin
        // Inicialmente solo se carga el idioma inicial y los de respaldo
        // Luego, conforme se usan tambien se cargan el resto
        this.plugins.get("rextexttranslationplugin").initI18Next(this, {
            // Idioma inicial
            lng: this.i18nConfig.defaultLanguage,
            // en caso de que no se encuentra una key en otro idioma se comprueba en los siguientes en orden
            fallbackLng: this.i18nConfig.defaultLanguage,
            // Idiomas permitidos
            // Sin esta propiedad a la hora de buscar las traducciones se podria buscar
            // en cualquier idioma (aunque no existiese)
            supportedLngs: this.i18nConfig.supportedLanguages,
            // IMPORTANTE: hay que precargar los namespaces de todos los idiomas porque sino a la hora
            // de usar un namespace por primera vez no le da tiempo a encontrar la traduccion
            // y termina usando la del idioma de respaldo
            preload: this.i18nConfig.supportedLanguages,
            // Namespaces que se cargan para cada uno de los idiomas
            ns: namespaces,
            // Mostrar informacion de ayuda por consola
            debug: this.i18nConfig.debug,
            // Cargar las traducciones de un servidor especificado en vez de ponerlas directamente
            backend: {
                // La ruta desde donde cargamos las traducciones
                // {{lng}} --> nombre carpeta de cada uno de los idiomas
                // {{ns}} --> nombre carpeta de cada uno de los namespaces
                loadPath: this.localizationPath + "/{{lng}}/{{ns}}.json"
            }
        })
    }
}