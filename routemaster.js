'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');

function getRoutingFiles(directory){
    return fs.readdirSync(directory).reduce(function(files, route){
        route = path.join(directory, route);

        if(fs.lstatSync(route).isDirectory()){
            return files.concat(getRoutingFiles(route));
        }
        files.push(route);

        return files;
    }, []);
}

function buildRouter(masterRouter, routingFile){
    masterRouter.use(require(routingFile)(new express.Router()));
    return masterRouter;
}

module.exports = function routemaster(directory){
    var parentDirectory = path.dirname(module.parent.filename);
    var routingDirectory = path.resolve(parentDirectory, directory);
    var routingFiles = getRoutingFiles(routingDirectory);

    return routingFiles.reduce(buildRouter, new express.Router());
};
