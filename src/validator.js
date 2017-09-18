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
                return statement._invoke(value, values);
            })
            .then(fieldRuleErrorGroups => {
                return fieldRuleErrorGroups.reduce((a, b) => a.concat(b));
            })
            .then(fieldRuleErrors => {
                return fieldRuleErrors.map(fieldRuleError => this.fieldRuleErrorToErrorMessage(fieldRuleError));
            });
    }

    fieldRuleErrorToErrorMessage(fieldRuleError) {
        const errorKey = fieldRuleError.getKey();
        let errorMessage = '';

        if (typeof this.messages[ errorKey ] !== 'undefined') {
            errorMessage = this.messages[ errorKey ];
        } else {
            errorMessage = fieldRuleError.getDefaultErrorMessage();
        }

        if (typeof errorMessage !== 'string') {
            const errorArgs = fieldRuleError.getErrorMessageArgs();
            errorMessage = errorMessage.apply(null, errorArgs);
        }

        return errorMessage;
    }
}

module.exports = Validator;