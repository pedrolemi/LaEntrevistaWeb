import ConditionNode from "./conditionNode.js";
import { EventNode } from "./eventNode.js";

export default class NodeReader {
    constructor(localization) {
        this.localization = localization
    }


    // Llama al metodo para leer todos los nodos y luego se encarga de conectarlos
    readNodes(scene, file, namespace, objectName, getObjs) {
        let nodesMap = new Map();
        let root = this.readAllNodes(scene, file, namespace, objectName, getObjs, nodesMap);

        // Recorre todos los nodos guardados en el mapa
        nodesMap.forEach((node) => {
            // Recorre el array de nodos siguientes leyendo sus ids
            for (let i = 0; i < node.next.length; i++) {
                // Obtiene el nodo del mapa a partir de su id y la reemplaza en el array
                let nextNode = nodesMap.get(node.next[i]);
                node.next[i] = nextNode;
            }
        });
        return root;
    }

    readAllNodes(scene, fullJson, namespace, objectName, getObjs, nodesMap) {
        let objectJson = (objectName === "") ? fullJson : fullJson[objectName];
        for (const [key, value] of Object.entries(objectJson)) {
            let id = key;

            // La id del nodo debe coincidir tanto en el json como en el archivo de traducciones, pero al estar
            // dentro de un objeto con (por ejemplo) nombre "object", un nodo con la id "name" deberia buscarse 
            // en el archivo de traducciones como object.name, pero la id de nodo seguiria siendo name
            let fullId = (objectName === "") ? id : objectName + "." + id;

            let globalId = namespace + "." + fullId

            // console.log(nodeId, fullId, globalId);


            // Si el nodo no se habia leido
            if (!nodesMap.has(globalId)) {
                let type = objectJson[id].type;
                let node = null;
                
                // Si el nodo es de tipo condicion
                if (type === "condition") {
                    node = new ConditionNode(scene, objectJson[id]);
                }
                else if (type === "text") {
                }
                else if (type === "choice") {
                }
                else if (type === "event") {
                    node = new EventNode(scene, objectJson[id]);
                }

                if (node != null) {
                    node.id = id;
                    node.fullId = fullId;
                    node.globalId = globalId;

                    node.nextDelay = (objectJson[id].nextDelay == null) ? 0 : objectJson[id].nextDelay
                    node.processNode();
                    
                    nodesMap.set(globalId, node);
                }
            }
        }
    }

    /**
    * Va leyendo los nodos del json de manera recursiva (el archivo se lee una sola vez y se pasa el objeto obtenido como parametro)
    *
    * @param {String} id - id del nodo que se lee. El nodo inicial es root
    * @param {Object} file - objeto obtenido como resultado de leer el json
    * @param {String} namespace - nombre del archivo de localizacion del que se va a leer
    * @param {String} objectName - nombre del objeto en el que esta el dialogo, si es que el json contiene varios dialogos de distintos objetos
    * @param {Boolean} getObjs - si se quiere devolver el nodo leido como un objeto 
    * @returns {DialogNode} - el nodo de dialogo que se ha procesado
    * 
    * IMPORTANTE: La estructura de nodos es comun a todos los idiomas y se tiene que guardar con anterioridad
    * al momento de crear la escena para luego pasarlo como parametro file. El archivo del que se van a leer las
    * traducciones es el que se pasa en el parametro namespace, y tiene que pasarse un string con el nombre del
    * archivo sin la extension .json
    * 
    * IMPORTANTE 2: En un nodo con condiciones, cada condicion lleva a otro nodo distinto.
    * Al momento de llegar a un nodo condicion, el siguiente nodo sera el indicado como siguiente
    * en la primera condicion que se cumpla (se van comprobando en el orden en el que se han leido).
    * Cada condicion puede tener varios requisitos (variables), en cuyo caso, la condicion solo 
    * se cumplira si todos sus requisitos se cumplen (operador &&. De momento no hay soporte para el operador || ) 
    * 
    */
    readAllNodes2(id, file, namespace, objectName, getObjs, nodesMap) {
        let fileObj = file;
        let translationId = id;

        // Si el dialogo esta dentro de algun objeto, se ajusta tanto el objeto
        // del json en el que buscar los nodos, como la id que utilizar para encontrar
        // la traduccion del nodo. Esto es porque la id del nodo debe coincidir tanto
        // en el json como en el archivo de traducciones, pero al estar dentro de un objeto
        // con (por ejemplo) nombre object, un nodo con la id name deberia buscarse en el 
        // archivo de traducciones como object.name, pero la id de nodo seguiria siendo name
        if (objectName !== "") {
            fileObj = this.getObjFromName(file, objectName);
            translationId = objectName + "." + id;
        }

        // Si el nodo ya se habia leido, lo devuelve
        if (nodesMap.has(translationId)) {
            return nodesMap.get(translationId);
        }
        // Si no, si la id del nodo no existe, devuelve null
        else if (!fileObj[id]) {
            return null;
        };

        // Crea el nodo y guarda sus atributos (se estableceran en el nodo al final)
        let node = new DialogNode();
        let nodeId = id;
        let type = fileObj[id].type;

        // Guarda el nodo y sus atributos base en caso de que se intente acceder a el antes
        // de que se termine de crear completamente (por si varios nodos llevan a el)
        nodesMap.set(translationId, node);
        node.id = nodeId;
        node.fullId = translationId;

        // Si el nodo es de tipo condicion
        if (type === "condition") {
            node = new ConditionNode();

            // Se leen todas las condiciones. Cada condicion lleva a un nodo distinto y 
            // en una condicion se pueden comprobar multiples variables
            for (let i = 0; i < fileObj[id].conditions.length; i++) {
                // Obtiene el nombre de las variables a comprobar (suprimiendo la propiedad next)
                let obj = Object.keys(fileObj[id].conditions[i]);
                let vars = obj.filter(key => key !== "next");

                let nodeConditions = [];

                // Recorre todas las variables obtenidas
                for (let j = 0; j < vars.length; j++) {
                    // Lee el nombre de la variable
                    let varName = vars[j];

                    // Obtiene el objeto que guarda las propiedades que tiene que cumplir la variable
                    let obj = fileObj[id].conditions[i][varName];

                    // Crea un objeto igual que obj, pero que tambien guarda su nombre
                    let condition = obj;
                    condition.key = varName

                    // Guarda el valor por defecto del objeto. Si no tiene 
                    // la propiedad en el json, se pone a false por defecto
                    let defaultValue = false;
                    if (obj.default) {
                        defaultValue = obj.default;
                    }

                    // Si no se ha definido si la variable es global o si se ha definido que si lo es,
                    // la guarda en el gameManager con su valor por defecto (si no se ha guardado antes)
                    if (obj.global === undefined || obj.global === true) {
                        if (!this.gameManager.hasValue(varName)) {
                            this.gameManager.setValue(varName, defaultValue);
                        }
                    }
                    // Si no, la guarda en la blackboard de la escena con su valor por defecto
                    // (si no se ha guardado antes) e indica que la blackboard en la que comprobar
                    // la variable es la de esta escena
                    else {
                        if (!this.gameManager.hasValue(varName, this.blackboard)) {
                            this.gameManager.setValue(varName, defaultValue, this.blackboard);
                        }
                        condition.blackboard = this.blackboard;
                    }

                    // Lo mete en las variables del nodo
                    nodeConditions.push(condition);
                }

                // Se guardan las condiciones 
                node.conditions.push(nodeConditions);

                // Si hay un nodo despues de este, se crea de manera y se
                // guarda la id de dicho nodo en el array de nodos siguientes
                if (fileObj[id].conditions[i].next) {
                    let nextNode = this.readAllNodes(fileObj[id].conditions[i].next, file, namespace, objectName, getObjs, nodesMap);
                    node.next.push(nextNode.fullId);
                }
            }
        }
        // Si el nodo es de tipo texto
        else if (type === "text") {
            node = new TextNode();
            // Obtiene la id del personaje y coge su nombre del archivo de nombres localizados
            let character = fileObj[id].character;
            node.character = character;
            node.name = this.gameManager.translate(fileObj[id].character, {
                ns: "names",
                returnObjects: getObjs
            });

            // Obtiene si el texto esta centrado o no
            if (fileObj[id].centered) {
                node.centered = fileObj[id].centered;
            }

            // Obtiene los fragmentos del dialogo
            let texts = [];
            let textTranslation = this.gameManager.translate(translationId, {
                ns: namespace,
                name: this.playerName,
                context: this.context,
                returnObjects: getObjs
            });

            // Si el texto no esta dividido en fragmentos, se guarda directamente en el array de textos
            if (!Array.isArray(textTranslation)) {
                texts.push(textTranslation);
            }
            // Si no, se guarda cada fragmento del dialogo en el array
            else {
                for (let i = 0; i < textTranslation.length; i++) {
                    texts.push(textTranslation[i]);
                }
            }

            // Se recorren todos los fragmentos de texto
            for (let i = 0; i < texts.length; i++) {
                // Se crea un dialogo con todo el texto a mostrar
                let split = {
                    text: texts[i],
                    name: node.name,
                }

                // Se separa el fragmento en caso de que el texto sea demasiado largo
                let dialogs = this.splitDialogs([split], character, node.centered);

                // Se concatenan los fragmentos obtenidos con los que ya habia en el nodo
                // (se tienen que concatenar, ya que splitDialogs devuelve un array, por
                // lo que hacer push a node.dialogs meteria los fragmentos en varios arrays)
                node.dialogs = node.dialogs.concat(dialogs);
            }
            node.currDialog = 0;

            // Si hay un nodo despues de este, se crea de manera y se
            // guarda la id de dicho nodo en el array de nodos siguientes
            if (fileObj[id].next) {
                let nextNode = this.readAllNodes(fileObj[id].next, file, namespace, objectName, getObjs, nodesMap);
                node.next.push(nextNode.fullId);
            }
        }
        // Si el nodo es de tipo opcion multiple
        else if (type === "choice") {
            node = new ChoiceNode();

            // Se obtienen las opciones del archivo de textos traducidos
            let texts = this.gameManager.translate(translationId, {
                ns: namespace, name: this.playerName,
                context: this.context,
                returnObjects: getObjs
            });

            for (let i = 0; i < fileObj[id].choices.length; i++) {
                let repeat = false;
                if (fileObj[id].choices[i].repeat === undefined || fileObj[id].choices[i].repeat) {
                    repeat = true;
                }
                let choice = {
                    text: texts[i],
                    repeat: repeat
                }

                // Se guarda la eleccion y se crea de manera recursiva
                // el nodo siguiente que corresponde a elegir dicha opcion
                node.choices.push(choice);

                // Si hay un nodo despues de este, se crea de manera y se
                // guarda la id de dicho nodo en el array de nodos siguientes
                if (fileObj[id].choices[i].next) {
                    let nextNode = this.readAllNodes(fileObj[id].choices[i].next, file, namespace, objectName, getObjs, nodesMap);
                    node.next.push(nextNode.fullId);
                }
                else {
                    node.next.push({});
                }
            }
        }
        // Si el nodo es de tipo evento
        else if (type === "event") {
            node = new EventNode();

            // Recorre todas las variables obtenidas
            for (let i = 0; i < fileObj[id].events.length; i++) {
                // Lee el nombre del evento
                let evtName = Object.keys(fileObj[id].events[i]);

                // Obtiene el objeto que guarda los parametros del evento 
                let obj = fileObj[id].events[i][evtName];

                // Crea un objeto igual que obj, pero que tambien guarda su nombre
                let evt = { ...obj };
                evt.name = evtName[0];

                // Si se ha definido si la variable es global y si se ha definido que no lo 
                // es, se guarda en las propiedades del evento la blackboard de esta escena
                if (obj.global !== undefined && obj.global === false) {
                    evt.blackboard = this.blackboard;
                }

                // Lo mete en las variables del nodo. Si es un evento de cambiar amistad, lo pone al principio de 
                // los eventos (por si acaso se lanzan a la vez otros eventos que cambien la escena, ya que hacen 
                // que los eventos de cambiar amistad no se lancen si van despues de un cambio de escena)
                if (evt.name === "changeFriendship") {
                    node.events.unshift(evt);
                }
                else {
                    node.events.push(evt);
                }
            }

            // Si hay un nodo despues de este, se crea de manera y se
            // guarda la id de dicho nodo en el array de nodos siguientes
            if (fileObj[id].next) {
                let nextNode = this.readAllNodes(fileObj[id].next, file, namespace, objectName, getObjs, nodesMap);
                node.next.push(nextNode.fullId);
            }
        }
        // Si el nodo es de tipo mensaje de texto
        else if (type === "chatMessage") {
            node = new ChatNode();

            // Obtiene el texto del archivo de textos traducidos y lo guarda
            let text = this.gameManager.translate(translationId + ".text", {
                ns: namespace,
                name: this.playerName,
                context: this.context,
                returnObjects: getObjs
            });

            node.text = text;

            // Obtiene el nombre del personaje del archivo de nombres localizados
            // En el caso de que se trate del jugador, obtiene su nombre
            let character = fileObj[id].character;

            let phone = fileObj[id].phone
            if (phone != null) {
                node.phone = phone
            }

            node.name = ""
            node.character = character;

            if (node.character != "") {
                if (node.phone) {
                    if (character === "player") {
                        node.name = this.gameManager.getUserInfo().name;
                    }
                    else {
                        node.name = this.gameManager.translate(fileObj[id].character, {
                            ns: "names"
                        });
                    }
                }
                else {
                    if (character === "player") {
                        node.name = this.computer.getUsername()
                    }
                    else {
                        node.name = this.gameManager.translate(character, {
                            ns: "computer\\usernames",
                        });
                    }
                }
            }

            node.chat = fileObj[id].chat
            // Guarda el chat en el que tiene que ir la respuesta y el retardo con el que se envia
            if (node.phone) {
                node.chat = this.gameManager.translate("textMessages" + "." + fileObj[id].chat, {
                    ns: "deviceInfo"
                });
            }

            if (fileObj[id].replyDelay) {
                node.replyDelay = fileObj[id].replyDelay;
            }

            // Si hay un nodo despues de este, se crea de manera y se
            // guarda la id de dicho nodo en el array de nodos siguientes
            if (fileObj[id].next) {
                let nextNode = this.readAllNodes(fileObj[id].next, file, namespace, objectName, getObjs, nodesMap);
                node.next.push(nextNode.fullId);
            }
        }
        // Si el nodo es de tipo comentario de la red social
        else if (type === "commentary") {
            node = new CommentaryNode();

            let text = this.gameManager.translate(translationId + ".text", {
                ns: namespace,
                name: this.playerName,
                context: this.context,
                returnObjects: getObjs
            });

            node.text = text;

            node.character = fileObj[id].character;

            if (node.character == "player") {
                node.name = this.computer.getUsername()
                node.pfp = "unknownPfp"
            }
            else {
                node.name = this.gameManager.translate(node.character, {
                    ns: "computer\\usernames",
                });

                let pfpsFile = this.cache.json.get("profilePictures");
                node.pfp = pfpsFile[node.character]
            }

            node.post = fileObj[id].post

            if (fileObj[id].replyDelay) {
                node.replyDelay = fileObj[id].replyDelay;
            }

            // Si hay un nodo despues de este, se crea de manera y se
            // guarda la id de dicho nodo en el array de nodos siguientes
            if (fileObj[id].next) {
                let nextNode = this.readAllNodes(fileObj[id].next, file, namespace, objectName, getObjs, nodesMap);
                node.next.push(nextNode.fullId);
            }
        }


        // Actualiza el nodo, ya que al momento de guardarse no estaba creado completamente
        nodesMap.set(translationId, node);
        node.id = nodeId;
        node.fullId = translationId;
        if (fileObj[id].nextDelay != null) {
            node.nextDelay = fileObj[id].nextDelay;
        }

        return node;
    }


    /**
    * Obtiene el objeto json a partir de su nombre
    * @param {Object} obj - objeto json en el que se busca el objeto 
    * @param {String} prop - nombre de la propiedad (o del objeto) que se busca 
    * @returns {Object} - objeto json con el nombre indicado
    */
    getObjFromName(obj, prop) {
        let nestedProperties = prop.split(".");
        let currObj = obj;

        for (let i = 0; i < nestedProperties.length; i++) {
            if (!currObj) {
                return null;
            }
            else {
                currObj = currObj[nestedProperties[i]];
            }
        }
        return currObj;
    }


    /**
    * Prepara los dialogos por si alguno es demasiado largo y se sale de la caja de texto
    * @param {Array} dialogs - array de dialogos a preparar
    * @returns {Array} - array con los dialogos ajustados
    */
    splitDialogs(dialogs, character, centered) {
        let newDialogs = [];        // Nuevo array de dialogos tras dividir los dialogos demasiado largos
        let i = 0;                  // Indice del dialogo en el array de dialogos
        let dialogCopy = "";        // Copia del dialogo con todos sus atributos
        let currText = "";          // Texto a dividir

        // Mientras no se haya llegado al final de los dialogos
        while (i < dialogs.length) {
            // Se establece si el texto esta centrado en la caja de texto para poder
            // hacer los saltos de liena con el ancho de linea correspondiente
            this.dialogManager.textbox.centerText(centered);

            // Cambia el texto a mostrar por el dialogo completo para obtener sus dimensiones 
            // (se copia la informacion del dialogo actual, pero se cambia el texto a mostrar)
            currText = dialogs[i].text;
            dialogCopy = { ...dialogs[i] };
            dialogCopy.text = currText;
            this.dialogManager.setText(dialogCopy, false);

            // Si la altura del texto supera la de la caja de texto 
            if (this.dialogManager.textTooBig()) {
                // Se separan todas las palabras del dialogo por espacios
                let words = currText.split(" ");
                let prevText = "";          // Texto antes de coger la siguiente palabra del dialogo
                let newText = "";           // Texto obtenido tras coger la siguiente palabra del dialogo
                let currWord = words[0];

                // Va recorriendo el array de palabras hasta que no quede ninguna
                while (words.length > 0) {
                    // Coge la primera palabra y actualiza tanto el
                    // texto anterior como el nuevo con dicha palabra
                    prevText = newText;
                    newText += " " + currWord;

                    // Cambia el texto por el nuevo para calcular sus dimensiones
                    dialogCopy = { ...dialogs[i] };
                    dialogCopy.text = newText;
                    this.dialogManager.setText(dialogCopy, false);

                    // Si no supera la altura de la caja de texto, saca la palabra del array
                    if (!this.dialogManager.textTooBig()) {
                        words.shift();
                        currWord = words[0];
                    }
                    // Si no, reinicia el texto y guarda el dialogo actual con el texto obtenido hasta el momento
                    else {
                        newText = "";
                        dialogCopy = { ...dialogs[i] };
                        dialogCopy.text = prevText;
                        newDialogs.push(dialogCopy);
                    }
                }
                // Una vez recorrido todo el dialogo, guarda el dialogo con el texto restante 
                prevText = newText;
                newText += " " + currWord;
                dialogCopy = { ...dialogs[i] };
                dialogCopy.text = prevText;
                newDialogs.push(dialogCopy);

                i++;
            }
            // Si la altura no supera la de la caja de texto, se guarda 
            // el dialogo actual y se pasa a mirar el siguiente
            else {
                dialogCopy = { ...dialogs[i] };
                dialogCopy.text = currText;
                newDialogs.push(dialogCopy);
                i++;
                if (dialogs[i]) currText = dialogs[i].text;
            }
        }

        let emptyDialog = {
            text: "",
            character: "",
            name: ""
        }

        this.dialogManager.setText(emptyDialog, false);
        return newDialogs;
    }
}