var accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';

var formatter = {};

formatter.type = 'text/html';

var util = require('util');

function test(formatter, accept) {
    var result = {};

    var reg = new RegExp('(' + formatter.type + '(?:;q=([0-9.]+))?)(?:,|$)'),
        match = reg.exec(accept);

    if (match) {
        result.q = +match[2];
    }

    return result;
}

console.log(test(formatter, accept));

function soften(type, softness) {
    var parts = type.split('/'),
        i, l;

    for (i = l = parts.length; i--;) {

        if (l - i <= softness) {
            parts[i] = soften.wildcard;
        }

    }

    return parts.join('/');
}

soften.wildcard = '*';

console.log(soften(formatter.type, 0));
console.log(soften(formatter.type, 1));
console.log(soften(formatter.type, 2));
