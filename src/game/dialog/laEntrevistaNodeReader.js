import NodeReader from "../../framework/dialog/nodeReader.js";
import LaEntrevistaTextNode from "./laEntrevistaTextNode.js";
import LaEntrevistaChoiceNode from "./laEntrevistaChoiceNode.js";

export default class LaEntrevistaNodeReader extends NodeReader {
    createTextNode(scene, objectJson, fullId, namespace) {
        return new LaEntrevistaTextNode(scene, objectJson, fullId, namespace);
    }

    createChoiceNode(scene, objectJson, fullId, namespace) {
        return new LaEntrevistaChoiceNode(scene, objectJson, fullId, namespace);
    }
}