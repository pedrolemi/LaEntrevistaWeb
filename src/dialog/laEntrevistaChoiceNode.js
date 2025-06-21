import ChoiceNode from "./baseClasses/choiceNode.js";

// TODO
export default class LaEntrevistaChoiceNode extends ChoiceNode {
    constructor(scene, node, fullId, namespace) {
        super(scene, node, fullId, namespace);

        this.prevText = "";
        this.prevTextObj = null;
        // this.onHideOptions = () => {
        //     super.onHideOptions();
        //     this.prevTextObj.destroy();
        // }
    }

    // createOptions() {
    //     super.createOptions();
    //     this.bgBlock.input.cursor = "";
    //     this.bgBlockRect.fillAlpha = 0.5;
    // }
}