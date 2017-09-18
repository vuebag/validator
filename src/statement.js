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

    _invokeRule(rule, value, validator) {
        return Promise.resolve( rule.invoke(value, validator) );
    }

    _invoke(value, validator) {
        const errors = [];

        return promiseTools
            .series(this.rules, rule => {
                return this._invokeRule(rule, value, validator)
                    .catch(() => {
                        const fieldRuleKey = this.field.getName() + '.' + rule.getName();
                        errors.push(fieldRuleKey);
                    });
            })
            .then(() => {
                return errors;
            });
    }
}

module.exports = Statement;