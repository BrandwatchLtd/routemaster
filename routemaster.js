'use strict';

var fs = require('fs');
var path = require('path');

function resolveDirectory(directory){
    var parentDirectory = path.dirname(module.parent.filename);

    return path.resolve(parentDirectory, directory);
}

function getRoutingFiles(directory){
    var target = resolveDirectory(directory);

    return fs.readdirSync(target).reduce(function(files, route){
        route = path.join(target, route);

        if(fs.lstatSync(route).isDirectory()){
            return files.concat(getRoutingFiles(route));
        }
        files.push(route);

        return files;
    }, []);
}

function appendToRouter(router, routingFile) {
    var routingFn = require(routingFile);

    if (typeof routingFn === 'function') {
        routingFn(router);
    }
}

module.exports = function routemaster(opts){
    var options = opts || {};

    if(!options.Router){
        throw new Error('Routemaster requires express.Router as its Router option');
    }

    if(!options.directory){
        throw new Error('Routemaster require a directory option');
    }

    var errorHandler = options.errorHandler || function(){};
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
