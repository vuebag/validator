class FieldRuleError {
    constructor(field, rule) {
        this.field = field;
        this.rule = rule;
    }

    getKey() {
        return this.field.getName() + '.' + this.rule.getName();
    }

    getDefaultErrorMessage() {
        return this.rule.getDefaultErrorMessage();
    }

    getErrorMessageArgs() {
        return [this.field.getName()].concat(this.rule.getHandlerArgs());
    }
}

module.exports = FieldRuleError;