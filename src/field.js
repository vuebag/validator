const objectPath = require('object-path');

class Field {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getValueForSegment(segmentName, segmentValues) {
        // cars[].models[].years
        const segments = segmentName.split('.');
        let currentSegment = segments.shift();
        if (segments.length === 1) {
            currentSegment
        }
        const currentValue = objectPath.get(segmentValues, currentSegment);
    }

    getValue(values) {
        return this.getValueForSegment(this.getName(), values);
    }

    /*invokeRule(rule, values) {
        const value = objectPath.get(values, this.getName());
        return Promise.resolve( rule.invoke(value) );
    }*/

    invokeRule(rule, values) {
        const segments = this.getName().split('.');
        let currentValue = values;
        for (let i = 0; i < segments.length; i++) {
            let currentSegment = segments[i];
            let currentKey = currentSegment;
            currentValue = objectPath.get(currentValue, currentKey);
        }

        return Promise.resolve( rule.invoke(value) );
    }
}

module.exports = Field;