const FieldRuleError = require('./field-rule-error');
const promiseTools = require('./tools/promise');

class Statement {
    constructor(field) {
        this.field = field;
        this.rules = [];
    }

    _getField() {
        return this.field;
    }

    _addRule(rule) {
        // TODO ensure rule is not already added
        this.rules.push(rule);
        return this;
    }

    _invokeRule(rule, value, values) {
        return Promise.resolve( rule.invoke(value, values) );
    }

    _invoke(value, values) {
        const errors = [];

        return promiseTools
            .series(this.rules, rule => {
                return this._invokeRule(rule, value, values)
                    .then(valid => {
                        if (!valid) {
                            errors.push(new FieldRuleError(this.field, rule));
                        }
                    });
            })
            .then(() => {
                return errors;
            });
    }
}

module.exports = Statement;