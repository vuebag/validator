const Validator = require('./src/validator');
const Statement = require('./src/statement');
const Rule = require('./src/rule');
const Field = require('./src/field');
const FieldArray = require('./src/field-array');

function validator(rules, messages) {
    return new Validator(rules, messages);
}

function field(name) {
    return new Statement(new Field(name));
}

field.prototype.array = function(name) {
    return new Statement(new FieldArray(name));
}

function extend(ruleName, handler) {
    Statement.prototype[ruleName] = function() {
        return this._addRule(new Rule(ruleName, handler, [].slice.call(arguments)));
    };
}

extend('required', (value, validator) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject();
        }, 1000);
    });
    return Promise.reject();
});

extend('min', (value, validator, length) => {
    return Promise.reject();
});

const test = validator([
    field('name').required().min(3),
    field('email').required(),
], {
    'name.required': 'NAME REQUIRED',
    'name.min': 'NAME MIN',
    'email.required': 'EMAIL REQUIRED',
});

test
    .test({
        name: 'John Doe',
    })
    .then(errors => {
        console.log(errors);
    })

module.exports = {
    validator,
    field,
    extend,
}