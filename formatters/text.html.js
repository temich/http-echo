exports.type = 'text/html';

exports.format = function(desc) {
    var lines = [],
        header;

    lines.push('<html><body><code><strong>' + desc.method + ' '  + desc.url + '</strong>');

    for (header in desc.headers) {
        lines.push('<strong>' + header + '</strong>: ' + desc.headers[header]);
    }

    lines.push('</code></body></html>')

    return lines.join('<br/>');
};