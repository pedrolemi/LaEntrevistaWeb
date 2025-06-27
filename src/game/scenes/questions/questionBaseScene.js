import LaEntrevistaBaseScene from "../../laEntrevistaBaseScene.js";

export default class QuestionBaseScene extends LaEntrevistaBaseScene {
    constructor(name) {
        super(name);
    }

    create(params) {
        super.create(params);

        this.nodes = this.cache.json.get("questions");
        this.namespace = "scenes\\questions";
        this.node = this.dialogManager.readNodes(this, this.nodes, this.namespace, "question" + params.number);

        this.dispatcher.add("endQuestion", this, () => {
            this.gameManager.startMirrorScene();
        });
    }

    onCreate() {
        setTimeout(() => {
            this.dialogManager.setNode(this.node);    
        }, 200);
    }
}