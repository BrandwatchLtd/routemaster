'use strict';

const fs = require('fs');
const path = require('path');

function resolveDirectory(directory) {
    const parentDirectory = path.dirname(module.parent.filename);

    return path.resolve(parentDirectory, directory);
}

function getRoutingFiles(directory) {
    const target = resolveDirectory(directory);
    const routes = fs.readdirSync(target);
    const files = [];

    for (const route of routes) {
        const routePath = path.join(target, route);
        const stat = fs.lstatSync(routePath);

        if (stat.isDirectory()) {
            files.push(...getRoutingFiles(routePath));
        } else {
            files.push(routePath);
        }
    }

    return files;
}

function appendToRouter(router, routingFile) {
    const routingFn = require(routingFile);

    if (typeof routingFn === 'function') {
        routingFn(router);
    }
}

module.exports = function routemaster(opts) {
    const options = opts || {};

    if (!options.Router) {
        throw new Error('Routemaster requires express.Router as its Router option');
    }

    if (!options.directory) {
        throw new Error('Routemaster require a directory option');
    }

    const errorHandler = options.errorHandler || (() => {});
    const routingFiles = getRoutingFiles(options.directory);
    const router = new options.Router();

    for (const file of routingFiles) {
        try {
            appendToRouter(router, file);
        } catch (e) {
            errorHandler(e);
        }
    }

    return router;
};
