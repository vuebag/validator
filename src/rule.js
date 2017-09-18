class Rule {
    constructor(name, handler, handlerArgs) {
        this.name = name;
        this.handler = handler;
        this.handlerArgs = handlerArgs;
    }

    getName() {
        return this.name;
    }

    invoke(value, validator) {
        const args = [value, validator].concat(this.handlerArgs);
        return this.handler.apply(this, args);
    }
}

module.exports = Rule;