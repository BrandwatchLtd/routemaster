'use strict';

var fs = require('fs');
var path = require('path');
var Router;

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

function buildRouter(masterRouter, routingFile){
    var router = new Router();
    var routingFn;

    try{
        routingFn = require(routingFile);
    } catch(e){}

    if(typeof routingFn === 'function'){
        routingFn(router);
    }

    masterRouter.use(router);
    return masterRouter;
}

module.exports = function routemaster(options){
    options = options || {};

    if(!options.Router){
        throw new Error('Routemaster requires express.Router as its Router option');
    }

    Router = options.Router;

    if(!options.directory){
        throw new Error('Routemaster require a directory option');
    }

    var routingFiles = getRoutingFiles(options.directory);

    return routingFiles.reduce(buildRouter, new Router());
};
