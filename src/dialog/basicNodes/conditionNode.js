import DialogNode from "./dialogNode.js";

export default class ConditionNode extends DialogNode {
    /**
    * Clase para la informacion de los nodos de de condicion
    * @extends DialogNode
    * 
    * Ejemplo:
        "nodeName": {
            "type": "condition", 
            "conditions": [
                {
                    "next": "notTalked",
                    "talked": {
                        "value": false,
                        "operator": "equal",
                        "global": false,
                        "default": true
                    },
                    "sponsored": {
                        "value": false,
                        "operator": "equal",
                        "type": "boolean",
                        "default": false
                    },
                    {...}
                },
                {
                    "next": "talked",
                    "talked": {
                        "value": true,
                        "operator": "equal"
                    }
                },
                {...}
            ]
        }
    */
    constructor(scene, node) {
        super();
        this.conditions = [];           // condiciones con su nombre/identificador y sus atributos
        
        let nodeConditions = node.conditions;

        // Recorre todas las condiciones generales del nodo (cada condicion lleva a un nodo distinto)
        for(let i = 0; i < nodeConditions.length; i++) {      
            // Obtiene el nombre de las variables a comprobar (todas las claves del objeto menos "next")
            let vars = Object.keys(nodeConditions[i]);
            vars = vars.filter(key => key !== "next");

            // Recorre cada condicion individual de la condicion general, guarda tambien el 
            // nombre de la variable, se anaden a lista de condiciones de la condicion general
            let conditionGroup = [];
            vars.forEach((key) => {
                let condition = nodeConditions[i][key];
                condition.variable = key;

                // Guarda el valor por defecto del objeto. Si no tiene la propiedad en el json, se pone a false por defecto
                let defaultValue = (condition.default == null) ? false : condition.default;

                // Determina en que blackboard guardar la variable. Si no se ha definido si es global, o si se
                // ha definido que si lo es, se guarda en la del gameManager. Si no, se guarda en la de la escena
                let blackboard = (condition.global == null || condition.global === true) ? scene.gameManager.blackboard : scene.blackboard;
                if (!blackboard.hasValue(key)) {
                    blackboard.setValue(key, defaultValue);
                }

                // Se guarda en la condicion en que blackboard comprobar su valor
                condition.blackboard = blackboard;

                conditionGroup.push(condition);
            });

            // Guarda la coleccion de condiciones individuales en la lista de condiciones generales
            // y el siguiente nodo a dicha condicion en la lista de nodso siguientes, de manera que
            // cada condicion general esta asociada a un nodo siguiente
            this.conditions.push(conditionGroup);
            this.next.push(nodeConditions[i].next);
        }

    }

    /**
    * El siguiente nodo sera el primero que cumpla todas las condiciones individuales de su condicion general
    * (se van comprobando en el orden en el que se han leido) la condicion solo se cumplira si todos sus requisitos
    * se cumplen (operador &&. De momento no hay soporte para el operador || ) 
    */
    processNode() {
        let conditionMet = false;
        let i = 0;

        // Recorre todas las condiciones hasta que se haya cumplido la primera
        while (i < this.conditions.length && !conditionMet) {
            let allConditionsMet = true;
            let j = 0;
            
            // Si no hay variables en la condicion, se cumple automaticamente
            if (this.conditions[i].length == 0) {
                conditionMet = true;
            }
            
            // Se recorren todas las variables de la condicion mientras se cumplan todas
            while (j < this.conditions[i].length && allConditionsMet) {
                // Coge el nombre de la variable, el operador y el valor esperado 
                let variable = this.conditions[i][j].variable;
                let operator = this.conditions[i][j].operator;
                let expectedValue = this.conditions[i][j].value;
                let blackboard = this.conditions[i][j].blackboard;

                // Busca el valor de la variable en la blackboard indicada. 
                // Si no es valida, buscara por defecto en el gameManager
                let variableValue = blackboard.getValue(variable);
                // console.log(variable + " " + variableValue);

                if (operator === "equal") {
                    conditionMet = variableValue === expectedValue;
                }
                else if (operator === "greater") {
                    conditionMet = variableValue >= expectedValue;

                }
                else if (operator === "lower") {
                    conditionMet = variableValue <= expectedValue;

                }
                else if (operator === "different") {
                    conditionMet = variableValue !== expectedValue;
                }
                // Se habran cumplido todas las condiciones si todas las condiciones
                // se han cumplido anteriormente y esta tambien se ha cumplido
                allConditionsMet &= conditionMet;

                j++;
            }

            // Si no se ha cumplido ninguna condicion, pasa a la siguiente
            if (!conditionMet) i++;
        }
        
        this.nextIndex = i;
        this.nextNode();
    }

    nextNode() {
        super.nextNode();
    }
}
