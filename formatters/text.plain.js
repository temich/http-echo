exports.type = 'text/plain';

exports.format = function(desc) {
    var lines = [],
        header;

    lines.push(desc.method + ' '  + desc.url);

    for (header in desc.headers) {
        lines.push(header + ': ' + desc.headers[header]);
    }

    return lines.join('\n');
};