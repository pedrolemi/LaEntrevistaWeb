import BaseBootScene from "../../framework/scenes/baseBootScene.js";

export default class BootScene extends BaseBootScene {
    preload() {
        super.preload();

        this.load.image("blankScreen", "assets/computer/blankScreen.png");
    }
}