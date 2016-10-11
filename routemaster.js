'use strict';

var path = require('path');
var glob = require('glob');

function getRoutingFiles(directory) {
    var parentDirectory = path.dirname(module.parent.filename);
    var resolvedDirectory = path.resolve(parentDirectory, directory);

    return glob.sync(path.join(resolvedDirectory, '/**/*.js'));
}

function appendToRouter(router, routingFile) {
    var routingFn = require(routingFile);

    if (typeof routingFn === 'function') {
        routingFn(router);
    }
}

module.exports = function routemaster(opts) {
    var options = opts || {};

    if (!options.Router) {
        throw new Error('Routemaster requires express.Router as its Router option');
    }

    if (!options.directory) {
        throw new Error('Routemaster require a directory option');
    }

    var errorHandler = options.errorHandler || function () {};
    var routingFiles = getRoutingFiles(options.directory);
    var router = new options.Router();

    for (var i = 0, len = routingFiles.length; i < len; i++) {
        try {
            appendToRouter(router, routingFiles[i]);
        } catch (e) {
            errorHandler(e);
        }
    }

    return router;
};
