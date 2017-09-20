const promiseTools = require('./tools/promise');

// TODO transpile source into a /dist/ directory
// TODO add ability to append rules at a later time
// TODO conditional fields?
// TODO conditional rules?
// TODO add support for OR relation between groups of rules?
// TODO replace [ field('fieldName').required() ] with { fieldName: Rule().required() }?
// TODO move the rule definitions to it's own container/schema instead of being bound to a validator instance?
// TODO depending on the above, provide immutable ways to get schema without specific rules (this would also mean that adding rules should be in an immutable fashion as well)
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