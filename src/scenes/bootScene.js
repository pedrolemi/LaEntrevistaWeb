// import GameManager from "../managers/gameManager.js";

// import SceneManager from "../managers/sceneManager";

import SceneManager from "../managers/sceneManager.js";
import Singleton from "../utils/singleton.js";

export default class BootScene extends Phaser.Scene {
    /**
    * Escena inicial en la que se cargan todos los recursos
    * @extends Phaser.Scene
    */
    constructor() {
        super({
            key: "BootScene",
            // Se carga el plugin i18next
            pack: {
                files: [{
                    type: "plugin",
                    key: "rextexttranslationplugin",
                    url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttranslationplugin.min.js",
                    start: true,
                    // Add text-translation plugin to `scene.translation`
                    mapping: "translation"
                }]
            }
        });
    }

    preload() {
        this.load.image("loadscreen", "assets/computer/loadscreen.png");
    }

    create() {
        this.createLoadingBar();
        this.loadAssets();

        let lol = new SceneManager(this);
        lol.fadeIn();
        
        this.events.once("start", () => {
            lol.changeScene("TestScene", null, true);

            // let gameManager = GameManager.create(this);

            // TEST
            // gameManager.startTestScene();

            // gameManager.startTitleScene();
        })
    }

    createLoadingBar() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(width / 2, height / 2, "loadscreen");
        let scale = width / bg.width;
        bg.setScale(scale);

        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();

        const BAR_W = width * 0.6;
        const BAR_H = 70;
        const BAR_OFFSET = 40;
        const FILL_OFFSET = 20;
        const TEXT_OFFSET = 70;
        let bgCol = 0x9c9edf;
        let fillCol = 0x7274b3;
        let borderCol = 0x000000;
        let borderThickness = 2;
        let radius = Math.min(BAR_W, BAR_H) * 0.25;

        progressBox.fillStyle(bgCol, 1).fillRoundedRect(width / 2 - BAR_W / 2, height / 2 - BAR_H / 2 - BAR_OFFSET, BAR_W, BAR_H, radius)
            .lineStyle(borderThickness, borderCol, 1).strokeRoundedRect(width / 2 - BAR_W / 2, height / 2 - BAR_H / 2 - BAR_OFFSET, BAR_W, BAR_H, radius)

        let textStyle = {
            fontFamily: "roboto-regular",
            fontSize: "30px",
            fill: "#000000",
            fontStyle: "bold"
        }
        // Texto de la palabra cargando
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - TEXT_OFFSET - BAR_OFFSET,
            text: "Loading...",
            style: textStyle
        });
        loadingText.setOrigin(0.5, 0.5);

        // Texto con el porcentaje de los assets cargados
        textStyle.fontSize = "20px";
        textStyle.fill = "#ffffff";
        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - BAR_OFFSET,
            text: "0%",
            style: textStyle
        });
        percentText.setOrigin(0.5, 0.5);

        // Texto para el nombre de los archivos
        textStyle.fill = "#000000";
        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + TEXT_OFFSET - BAR_OFFSET,
            text: "",
            style: textStyle
        });
        assetText.setOrigin(0.5, 0.5);

        // Se va actualizando la barra de progreso y el texto con el porcentaje
        this.load.on("progress", function (value) {
            percentText.setText(parseInt(value * 100) + "%");

            progressBar.clear();
            progressBar.fillStyle(fillCol, 1);
            progressBar.fillRoundedRect(width / 2 - (BAR_W - FILL_OFFSET) / 2, height / 2 - (BAR_H - FILL_OFFSET) / 2 - BAR_OFFSET, (BAR_W - FILL_OFFSET) * value, BAR_H - FILL_OFFSET, radius);
        });

        // Cuando carga un archivo, muestra el nombre del archivo debajo de la barra
        this.load.on("fileprogress", function (file) {
            // console.log(file.key);
            assetText.setText("Loading asset: " + file.key);
        });

        // // Cuando se termina de cargar todo, se borran los elementos de la barra
        // this.load.once("complete", function () {
        //     progressBar.destroy();
        //     progressBox.destroy();
        //     loadingText.destroy();
        //     percentText.destroy();
        //     assetText.destroy();
        //     bg.destroy();
        // });
    }

    loadi18next(dialogsAndNamespaces, onlyNamespaces) {
        let namespaces = dialogsAndNamespaces.concat(onlyNamespaces);

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
            lng: "es",
            // en caso de que no se encuentra una key en otro idioma se comprueba en los siguientes en orden
            fallbackLng: "es",
            // Idiomas permitidos
            // Sin esta propiedad a la hora de buscar las traducciones se podria buscar
            // en cualquier idioma (aunque no existiese)
            supportedLngs: ["es"],
            // IMPORTANTE: hay que precargar los namespaces de todos los idiomas porque sino a la hora
            // de usar un namespace por primera vez no le da tiempo a encontrar la traduccion
            // y termina usando la del idioma de respaldo
            preload: ["es"],
            // Namespaces que se cargan para cada uno de los idiomas
            ns: namespaces,
            // Mostrar informacion de ayuda por consola
            debug: false,
            // Cargar las traducciones de un servidor especificado en vez de ponerlas directamente
            backend: {
                // La ruta desde donde cargamos las traducciones
                // {{lng}} --> nombre carpeta de cada uno de los idiomas
                // {{ns}} --> nombre carpeta de cada uno de los namespaces
                loadPath: "localization/{{lng}}/{{ns}}.json"
            }
        })
    }

    loadDialogs(dialogsAndNamespaces) {
        // Archivos de dialogos (estructura)
        this.load.setPath("localization/structure");

        dialogsAndNamespaces.forEach((dialog) => {
            // Quedarse con la ultima parte del path, que corresponde con el id del archivo
            let subPaths = dialog.split("/");
            let name = subPaths[subPaths.length - 1];
            // Ruta completa (dentro de la carpeta structure y con el extension .json)
            let wholePath = dialog + ".json";
            this.load.json(name, wholePath);
        });
    }

    loadAssets() {
        // Son tanto archivos de dialogos como namespaces del plugin i18next
        // Ruta archivo dialogo --> structure/test/dialog.json
        // Id archivo dialogo --> dialog
        // Namespace --> test\\dialog.json
        let dialogsAndNamespaces = [
        ]
        // Solo son namespaces del plugin i18next
        // Namespace --> test\\dialog.json
        let onlyNamespaces = [
        ]

        this.loadDialogs(dialogsAndNamespaces);
        this.loadBullshit();

        this.load.setPath("assets");

        this.loadi18next(dialogsAndNamespaces, onlyNamespaces);

        // Indicar a LoaderPlugin que hay que cargar los assets que se encuentran en la cola
        // Nota: despues del preload este metodo se llama automaticamente, pero si se quieren cargar assets en otra parte hay que llamarlo manualmente
        this.load.start();

        this.load.once("complete", () => {
            this.events.emit("start");
        });
    }
    
}