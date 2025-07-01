import Blackboard from "../../framework/utils/blackboard.js";
import Singleton from "../../framework/utils/singleton.js";
import SceneManager from "../../framework/managers/sceneManager.js";
import EventDispatcher from "../../framework/managers/eventDispatcher.js";

export default class GameManager extends Singleton {
    constructor() {
        super("GameManager");

        this.sceneManager = SceneManager.getInstance();
        this.dispatcher = EventDispatcher.getInstance();

        // Blackboard de variables de todo el juego
        this.blackboard = new Blackboard();

        this.ui = null;

        this.nInteractedCharacters = 0;
        this.N_REQUIRED_INTERACTIONS = 8;

        this.nQuestionsCompleted = 0;
        this.N_REQUIRED_QUESTIONS = 9;
    }

    init() {
        this.ui = this.sceneManager.getScene("UI");

        this.startGame();
        // this.startMainMenu();
    }

    startGame() {
        this.nInteractedCharacters = 0;
        this.nQuestionsCompleted = 0;

        this.blackboard.clear();
        this.dispatcher.removeAll();

        if (this.ui.dispatcher != null) {
            this.ui.shutdown();
            this.sceneManager.restartScene("UI");
        }

        this.blackboard.set("position", "dataScience");

        // this.startHouseScene();

        // TEST
        // this.startMainMenu();
        // this.startHallScene();
        // this.startCorridorScene();
        // this.startCafeteriaScene();
        // this.startWaitingRoomScene();
        // this.startOfficeScene();
        // this.startMirrorScene();
        // this.startQuestionScene(1);
        // this.startCreditsScene();
        this.startLanguageMenu();
    }

    startMainMenu(fadeAnim = true) {
        this.sceneManager.changeScene("MainMenu", null, fadeAnim);
    }

    startHouseScene() {
        this.sceneManager.changeScene("House", null, true);
    }

    startHallScene() {
        this.sceneManager.changeScene("Hall", null, true);
    }

    startCorridorScene() {
        this.sceneManager.changeScene("Corridor", null, true, true);
    }

    startCafeteriaScene() {
        this.sceneManager.changeScene("Cafeteria", null, true, true);
    }

    startWaitingRoomScene() {
        this.sceneManager.changeScene("WaitingRoom", null, true, true);
    }

    startOfficeScene() {
        this.sceneManager.changeScene("Office", null, true, true);
    }

    startMirrorScene() {
        this.sceneManager.changeScene("Mirror", null, true, false);
        if (this.nQuestionsCompleted >= this.N_REQUIRED_QUESTIONS) {
            this.dispatcher.dispatch("allQuestionsComplete");
        }
    }

    startQuestionScene(number) {
        this.sceneManager.changeScene("Question" + number, { number: number }, true, true);
    }

    startCreditsScene(fadeAnim = true) {
        this.sceneManager.changeScene("Credits", null, fadeAnim);
    }

    startLanguageMenu() {
        this.sceneManager.changeScene("LanguageMenu", null, false);
    }

    /**
    * Incrementar el numero de personajes con los que se ha hablado
    */
    increaseInteractedCharacters() {
        ++this.nInteractedCharacters;
        if (this.nInteractedCharacters >= this.N_REQUIRED_INTERACTIONS) {
            console.log(this.nInteractedCharacters);
            this.dispatcher.dispatch("allPeopleInteracted");
        }
    }
}