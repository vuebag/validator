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

    _hasRule(ruleName) {
        return this.rules.filter(rule => rule.getName() === ruleName).length > 0;
    }

    _addRule(rule) {
        if (this._hasRule(rule.getName())) {
            throw new Error(`Attempted to add duplicate rule "${rule.getName()}"`);
        }
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