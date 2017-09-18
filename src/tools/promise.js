function series(items, handler) {
    const itemsLeft = items.slice(0);
    const nextItem = itemsLeft.shift();
    const results = [];

    if (typeof nextItem === 'undefined') {
        return Promise.resolve(results);
    }

    return handler(nextItem)
        .then(result => {
            results.push(result);
            return series(itemsLeft, handler);
        })
        .then(subresults => results.concat(subresults));
}

module.exports = {
    series,
};