/**
* Comprueba y guarda las propiedades de defaultObj que falten en targetObj 
* @param {Object} targetObj - objeto a completar con las propiedades faltantes
* @param {Object} defaultObj - objeto del que mirar las propiedades faltantes
* @returns {Object} - copia de targetObj con las propiedades que le falten de defaultObj
*/
export function completeMissingProperties(targetObj, defaultObj) {
    const completedObj = { ...targetObj };

    const defaultKeys = Object.keys(defaultObj);

    defaultKeys.forEach(key => {
        if (!(key in completedObj)) {
            completedObj[key] = defaultObj[key];
        }
    });

    return completedObj;
}

/**
* Mueve un punto current hacia un punto target una distancia maxima maxDistanceDelta.
* Si la distancia entre current y target es menor o igual a maxDistanceDelta, 
* la funcion devuelve el punto target directamente
* @param {Object} current - punto actual con propiedades {x, y}
* @param {Object} target - punto destino con propiedades {x, y}
* @param {number} maxDistanceDelta - distancia maxima que se puede mover desde el punto actual
* @returns {Object} - nuevo punto movido hacia target
*/
export function moveTowards(current, target, maxDistanceDelta) {
    let directionX = target.x - current.x;
    let directionY = target.y - current.y;
    let distance = Math.hypot(directionX, directionY);

    if (distance <= maxDistanceDelta || distance < 0.1) {
        return target;
    }

    let ratio = maxDistanceDelta / distance;
    return {
        x: current.x + directionX * ratio,
        y: current.y + directionY * ratio
    }
}