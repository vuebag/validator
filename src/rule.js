class Rule {
    constructor(name, defaultErrorMessage, handler, handlerArgs) {
        this.name = name;
        this.defaultErrorMessage = defaultErrorMessage;
        this.handler = handler;
        this.handlerArgs = handlerArgs;
    }

    getName() {
        return this.name;
    }

    getDefaultErrorMessage() {
        return this.defaultErrorMessage;
    }

    getHandlerArgs() {
        return this.handlerArgs;
    }

    invoke(value, validator) {
        const args = [value, validator].concat(this.handlerArgs);
        return this.handler.apply(this, args);
    }
}

module.exports = Rule;