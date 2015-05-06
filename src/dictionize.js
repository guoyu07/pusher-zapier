var dictionize = function(data) {
    var trim = function(str) {
        return String((str === null) || (str === void 0) ? '' : str).replace(/^\s+|\s+$/g, '');
    };

    // port of python's dictionize data
    if (data && _.isObject(data)) {
        return data;
    }

    var d = {};
    if (data && _.isString(data) && data.indexOf('|') !== -1) {
        var lines_copy = trim(data).split(/\r?\n/);

        // combine lines that have no '|'
        var lines = [];
        _.each(lines_copy, function(line) {
            if (line) {
                if (line.indexOf('|') !== -1) {
                    lines.push(line);
                } else if (lines) {
                    lines[lines.length - 1] += '\n' + (line || '');
                }
            }
        });

        _.each(lines, function(line) {
            var components = trim(line).split('|');
            var k = components.shift();
            var v = components.join('|');
            d[trim(k)] = trim(v);
        });
    }
    return d;
};
