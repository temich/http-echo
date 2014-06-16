var http = require('http'),
    response = require('./response');

function handle(req, res) {
    console.info('\nProcessing ' + req.method + ' ' + req.url);

    var resp = response.resolve(req),
        headers = {};

    if (!resp.type) {
        res.writeHead(406);
        res.end('No acceptable media type found');

        console.warn('No acceptable media type found');
        console.warn('Accept: ' + req.headers.accept);

        return;
    }

    headers['content-type'] = resp.type;
    headers['content-length'] = typeof resp.representation === 'string' ? Buffer.byteLength(resp.representation) : 0;

    res.writeHead(200, headers);
    res.end(resp.representation);
}

http.createServer(handle).listen(8080);
console.info('Server started');
