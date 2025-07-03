import BaseBootScene from "../../framework/scenes/baseBootScene.js";

import DialogManager from "../managers/dialogManager.js";
import GameManager from "../managers/gameManager.js";

export default class BootScene extends BaseBootScene {
    preload() {
        super.preload();

        this.load.image("blankScreen", "assets/computer/blankScreen.png");
    }

    create() {
        this.DEFAULT_LOADING_BAR_CONFIG.y = this.CANVAS_HEIGHT * 0.4;
        this.DEFAULT_LOADING_BAR_CONFIG.bgColor = 0xab3d32;
        this.DEFAULT_LOADING_BAR_CONFIG.fillColor = 0xe06d61;

        let getSceneDialogPath = (scene) => {
            return `scenes/${scene}`
        }

        let dialogNamespaces = [
            getSceneDialogPath("test"),
            getSceneDialogPath("house"),
            getSceneDialogPath("hall"),
            getSceneDialogPath("corridor"),
            getSceneDialogPath("cafeteria"),
            getSceneDialogPath("office"),
            getSceneDialogPath("mirror"),
            getSceneDialogPath("questions"),
            getSceneDialogPath("waitingRoom")
        ];
        let basicNamespaces = [
            "names",
            "CVs",
            "scenes",
            "creditsTitles",
        ]

        let loadAssets = () => {
            this.loadComputer();
            this.loadBackgrounds();
            this.loadCharacters();
            this.loadUI();

            this.load.setPath("");
            this.load.json("creditsNames", this.LOCALIZATION_PATH + "/creditsNames.json");
        }

        let bg = this.add.image(0, 0, "blankScreen").setOrigin(0, 0);

        super.create(loadAssets, true, dialogNamespaces, basicNamespaces);

        let dialogManager = DialogManager.create();
        dialogManager.init();

        this.events.once("start", () => {
            let gameManager = GameManager.create();
            gameManager.init();
        })
    }

    loadPointers() {
        let defaultPath = "assets/UI/pointers/"

        this.scene.scene.registry.set("default", `${defaultPath}default.png`);
        this.scene.scene.registry.set("pointerOver", `${defaultPath}over.png`);

        this.input.setDefaultCursor(`url(${this.scene.scene.registry.get("default")}), pointer`);
    }

    loadComputer() {
        this.load.setPath("assets/computer");

        // this.load.image("blankScreen", "blankScreen.png");
        this.load.image("desktop", "desktop.png");
        this.load.image("browser", "browser.png");
        this.load.image("portalLogo", "portalLogo.png");
        this.load.image("data", "data.jpg");
        this.load.image("programming", "programming.jpg");
    }

    loadCafeteria() {
        this.load.setPath("assets/backgrounds/cafeteria");

        this.load.image("cafeteria", "cafeteria.png");
        this.load.image("chairs", "chairs.png");
        this.load.image("tableLegs", "tableLegs.png");
        this.load.image("tableTop", "tableTop.png");
    }

    loadCorridor() {
        this.load.setPath("assets/backgrounds/corridor");

        this.load.image("corridor", "corridorTextless.png");
    }

    loadBackgrounds() {
        this.loadCafeteria();
        this.loadCorridor();

        this.load.setPath("assets/backgrounds");

        this.load.image("mainMenu", "menus/mainMenu.png");
        this.load.image("mainMenuBlank", "menus/mainMenuBlank.png");
        this.load.image("credits", "menus/credits.png");

        this.load.video("startGameAnimation", "menus/startGameAnimation.mp4", true);
        this.load.video("enterCreditsAnimation", "menus/enterCreditsAnimation.mp4", true);
        this.load.video("exitCreditsAnimation", "menus/exitCreditsAnimation.mp4", true);

        this.load.image("hall", "hall.png");
        this.load.image("counter", "counter.png");

        this.load.image("waitingRoom", "waitingRoomTextless.png");

        this.load.image("office", "office.png");
        this.load.image("desk", "desk.png");

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
        this.loadCharacterAtlas("Ivan");
    }

    loadUI() {
        this.loadPointers();

        this.load.setPath("assets/UI/flags");
        this.load.atlas("flags", "flags.png", "flags.json");

        this.load.setPath("assets/UI");

        this.load.image("textbox", "textbox.png");
        this.load.image("optionBox", "optionBox.png");

        this.load.image("cvSheet", "cvSheet.png");

        this.load.image("questionButton", "questionButton.png");
        this.load.image("questionArrow", "questionArrow.png");

        this.load.image("frontArrow", "frontArrow.png");
        this.load.image("sideArrow", "sideArrow.png");

    }
}