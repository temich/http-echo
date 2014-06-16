var fs = require('fs'),
    path = require('path');

var PATH = './formatters';

var formatters;

formatters = fs.readdirSync(PATH).map(function (name) {
    return require(path.resolve(PATH, name));
});

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

function test(formatter, accept, iteration) {
    var result = null,
        type = soften(formatter.type, iteration || 0),
        reg = new RegExp('(' + type.replace('*', '\\*') + '(?:;q=([0-9.]+))?)(?:,|$)'),
        match = reg.exec(accept),
        q;

    iteration || (iteration = 0);

    if (!match && iteration < 2) {
        return test(formatter, accept, iteration + 1);
    }

    if (match) {
        result = {};
        q = match[2];
        result.q = typeof q === 'undefined' ? 1.0 : +q;
        result.type = type;
    }

    return result;
}

function resolve(accept) {
    var ambiguous = [],
        result = null,
        found;

    found = !formatters.every(function (formatter) {
        var res = test(formatter, accept);

        if (!res) {
            return true; // continue loop
        }

        res.formatter = formatter;

        if (res.q === 1.0) {
            result = res;
            return false; // break loop
        }

        if (res.q > 0) {
            ambiguous.push(res);
        }

        return true;
    });

    if (!found) {

        if (!ambiguous.length) {
            return null; // no matched formatter
        }

        // TODO: choose ambigous
    }

    return result.formatter;
}

function Representation(req) {
    var formatter = resolve(req.headers.accept),
        desc = {};

    if (!formatter) {
        return;
    }

    Representation.PARAMS.forEach(function (name) {
        desc[name] = req[name];
    });

    this.type = formatter.type;
    this.representation = formatter.format(desc);
}

Representation.PARAMS = ['method', 'url', 'httpVersion', 'headers'];

exports.create = function (req) {
    return new Representation(req);
};