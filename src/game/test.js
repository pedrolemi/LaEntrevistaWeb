import BaseScene from "../framework/scenes/baseScene.js";
import ScrollListView from "../framework/UI/scrollListView.js";

export default class Test extends BaseScene {
    constructor() {
        super("Test");
    }

    create(params) {
        super.create(params);

        console.log(Phaser.Scenes.Events.CREATE)
        console.log(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN);
        let x = this.CANVAS_WIDTH / 2;
        let y = this.CANVAS_HEIGHT / 2;

        let aaa = new ScrollListView(this, x, y, 300, 300);
        aaa.test1();

        let bbb = new ScrollListView(this, 0, 0, 300, 300, false);
        bbb.test1(0xffffff);

        aaa.addToEnd(bbb);
        // aaa.setOrigin(0, 0);
        // console.log(aaa.originX, aaa.originY);

        let size = 10;
        this.add.rectangle(x, y, size, size, 0xffffff, 1);
    }
}