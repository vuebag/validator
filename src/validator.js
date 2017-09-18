const objectPath = require('object-path');
const promiseTools = require('./tools/promise');

class Validator {
    constructor(statements, messages) {
        // TODO validate rules is array
        // TODO validate all elements in rules are valid rules
        this.statements = statements;
        this.messages = messages;
    }

    test(values) {
        return promiseTools
            .series(this.statements, statement => {
                const value = objectPath.get(values, statement._getField().getName());
                return statement._invoke(value, this);
            })
            .then(errors => {
                return errors.reduce((a, b) => a.concat(b));
            })
            .then(errors => {
                const userErrors = [];
                for (let i = 0; i < errors.length; i++) {
                    // TODO implement default error messages
                    userErrors.push(this.messages[ errors[i] ]);
                }
                return userErrors;
            });
    }
}

module.exports = Validator;