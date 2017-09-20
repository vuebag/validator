const promiseTools = require('./tools/promise');

// TODO conditional fields?
// TODO conditional rules?
class Validator {
    constructor(statements, messages) {
        messages = typeof messages !== 'undefined' ? messages : [];
        this.statements = statements;
        this.messages = messages;
    }

    test(values) {
        return promiseTools
            .series(this.statements, statement => {
                return statement._invoke(values);
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