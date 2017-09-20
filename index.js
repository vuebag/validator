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

function extend(ruleName, defaultErrorMessage, handler) {
    Statement.prototype[ruleName] = function() {
        return this._addRule(new Rule(ruleName, defaultErrorMessage, handler, [].slice.call(arguments)));
    };
}

extend('required', 'required', value => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(false);
        }, 1000);
    });
});

extend('min', (fieldName, min) => {
    return `${fieldName}: ${min}`;
}, (value, length) => {
    return false;
});

const test = validator([
    field('name').required().min(3),
    field('email').required(),
    field('phone').required(),
], {
    'name.required': 'NAME REQUIRED',
    'email.required': fieldName => `FIELD REQUIRED: ${fieldName}`,
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