import SceneManager from "../managers/sceneManager.js";
import GameManager from "../managers/gameManager.js";

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
        this.load.image("blankScreen", "assets/computer/blankScreen.png");
    }

    create() {
        this.createLoadingBar();
        this.loadAssets();

        let sceneManager = SceneManager.create();
        sceneManager.init(this);
        // sceneManager.fadeIn();

        this.events.once("start", () => {
            let gameManager = GameManager.create();

            gameManager.startGame();
        })
    }

    createLoadingBar() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // Fondo escalado en cuanto al canvas
        let bg = this.add.image(width / 2, height / 2, "blankScreen");
        let scale = width / bg.width;
        bg.setScale(scale);

        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();

        const BAR_W = width * 0.5;
        const BAR_H = 70;
        const BAR_OFFSET = 80;
        const FILL_OFFSET = 20;
        const TEXT_OFFSET = 70;
        let bgCol = 0xab3d32;
        let fillCol = 0xe06d61;
        let borderCol = 0xFFFFFF;
        let borderThickness = 2;
        let radius = Math.min(BAR_W, BAR_H) * 0.25;

        progressBox.fillStyle(bgCol, 1).fillRoundedRect(width / 2 - BAR_W / 2, height / 2 - BAR_H / 2 - BAR_OFFSET, BAR_W, BAR_H, radius)
            .lineStyle(borderThickness, borderCol, 1).strokeRoundedRect(width / 2 - BAR_W / 2, height / 2 - BAR_H / 2 - BAR_OFFSET, BAR_W, BAR_H, radius)

        let textStyle = {
            // fontFamily: "roboto-regular",
            fontSize: 30,
            fill: "#FFFFFF",
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
        textStyle.fontSize =  20;
        textStyle.fill = "#FFFFFF";
        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - BAR_OFFSET,
            text: "0%",
            style: textStyle
        });
        percentText.setOrigin(0.5, 0.5);

        // Texto para el nombre de los archivos
        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + TEXT_OFFSET - BAR_OFFSET,
            text: "",
            style: textStyle
        });
        assetText.setOrigin(0.5, 0.5);

        // Se va actualizando la barra de progreso y el texto con el porcentaje
        this.load.on("progress", function (value) {
            if (value > 0) {
                percentText.setText(parseInt(value * 100) + "%");
                progressBar.clear();
                progressBar.fillStyle(fillCol, 1);
                progressBar.fillRoundedRect(width / 2 - (BAR_W - FILL_OFFSET) / 2, height / 2 - (BAR_H - FILL_OFFSET) / 2 - BAR_OFFSET, (BAR_W - FILL_OFFSET) * value, BAR_H - FILL_OFFSET, radius);
            }
        });

        // Cuando carga un archivo, muestra el nombre del archivo debajo de la barra
        this.load.on("fileprogress", function (file) {
            // console.log(file.key);
            assetText.setText("Loading asset: " + file.key);
        });
    }

    loadAssets() {
        // Son tanto archivos de dialogos como namespaces del plugin i18next
        // Ruta archivo dialogo --> structure/test/dialog.json
        // Id archivo dialogo --> dialog
        // Namespace --> test\\dialog.json
        let dialogsAndNamespaces = [
            "scenes/house",
            "scenes/test"
        ]
        // Solo son namespaces del plugin i18next
        // Namespace --> test\\dialog.json
        let onlyNamespaces = [
            "names",
            "CVs"
        ]

        this.loadDialogs(dialogsAndNamespaces);
        this.loadComputer();
        this.loadBackgrounds();
        this.loadCharacters();
        this.loadUI();

        this.load.setPath("assets");

        this.loadi18next(dialogsAndNamespaces, onlyNamespaces);

        // Indicar a LoaderPlugin que hay que cargar los assets que se encuentran en la cola
        // Nota: despues del preload este metodo se llama automaticamente, pero si se quieren cargar assets en otra parte hay que llamarlo manualmente
        this.load.start();

        this.load.once("complete", () => {
            this.events.emit("start");
        });
    }


    loadComputer() {
        this.load.setPath("assets/computer");

        this.load.image("mainMenu", "mainMenu.png");
        this.load.image("credits", "credits.png");

        this.load.video("creditsAnimation", "animacioncreditos.mp4", true);
        this.load.video("startAnimation", "animacionmenu.mp4", true);

        // this.load.image("blankScreen", "blankScreen.png");
        this.load.image("desktop", "desktop.png");
        this.load.image("browser", "browser.png");
        this.load.image("portalLogo", "portalLogo.png");
        this.load.image("data", "data.jpg");
        this.load.image("programming", "programming.jpg");
    }

    loadBackgrounds() {
        this.load.setPath("assets/backgrounds");

        this.load.image("hall", "hall.png");
        this.load.image("counter", "counter.png");

        this.load.image("corridor", "corridorTextless.png");

        this.load.image("waitingRoom", "waitingRoomTextless.png");

        this.load.image("cafeteria", "cafeteria.png");
        this.load.image("chairs", "chairs.png");
        this.load.image("tableLegs", "tableLegs.png");
        this.load.image("tableTop", "tableTop.png");

        this.load.image("office", "office.png");
        this.load.image("officeTable", "officeTable.png");

        this.load.image("30min", "30min.png");

        this.load.image("mirror", "mirror.png");
        this.load.image("mirrorEffect", "mirrorEffect.png");
    }

    loadCharacterAtlas(name) {
        let path = name + "/" + name

        this.load.atlas(name, path + '.png', path + '.json');

        const ANIMATIONS_KEY = "Animations"
        let animationsPath = path + ANIMATIONS_KEY
        this.load.animation(name + ANIMATIONS_KEY, animationsPath + '.json')
    }

    loadCharacters() {
        this.load.setPath("assets/characters");
        
        this.loadCharacterAtlas("Jesus");
        this.loadCharacterAtlas("Pedro");
        this.loadCharacterAtlas("Carlos");
        this.loadCharacterAtlas("Monica");
        this.loadCharacterAtlas("Rebeca");
        this.loadCharacterAtlas("Antonio");
        this.loadCharacterAtlas("Luis");
        this.loadCharacterAtlas("Andres");
        this.loadCharacterAtlas("Luisa");
        this.loadCharacterAtlas("Jaime");
        this.loadCharacterAtlas("Alex");
    }

    loadUI() {
        this.load.setPath("assets/UI");

        this.load.image("textbox", "textbox.png");
        this.load.image("optionBox", "optionBox.png");
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

}