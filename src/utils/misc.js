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