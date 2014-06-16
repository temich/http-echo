exports.type = 'application/json';

exports.format = function(desc) {
    return JSON.stringify(desc, null, 4);
};
