const Field = require('./field');
const promiseTools = require('./tools/promise');

class FieldArray extends Field {
    invokeRule(rule, values) {
        const valueArray = objectPath.get(values, this.getName());

        if (!Array.isArray(valueArray)) {
            return Promise.resolve(false);
        }

        return promiseTools
            .series(valueArray, value => Promise.resolve( rule.invoke(value) ))
            .then(results => {
                const allValid = results.reduce(() => {}, true);
                return Promise.resolve( results.)
            })
        return Promise.all(promises);
    }
}

module.exports = FieldArray;