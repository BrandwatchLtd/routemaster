'use strict';

const assert = require('assert');
const express = require('express');
const routemaster = require('../routemaster');

function isExpressRouter(router) {
    if (typeof router !== 'function') {
        return false;
    }
    if (typeof router.get !== 'function') {
        return false;
    }
    if (typeof router.handle !== 'function') {
        return false;
    }
    if (typeof router.use !== 'function') {
        return false;
    }

    return true;
}

describe('routemaster', () => {
    var router;

    before(() => {
        router = routemaster({
            directory: '../example',
            Router: express.Router
        });
    });

    it('throws if the express.Router option isn\'t passed', () => {
        assert.throws(routemaster, /Routemaster requires express.Router as its Router option/);
    });

    it('throws if the directory option isn\'t passed', () => {
        assert.throws(() => {
            routemaster({Router: express.Router});
        }, /Routemaster require a directory option/);
    });

    it('returns an Express Router', () => {
        assert.strictEqual(isExpressRouter(router), true);
    });

    describe('the routing file ../example/routingFile', () => {
        it('should be part of the router', done => {
            router.handle({url: '/', method: 'GET'}, {end: done});
        });
    });

    describe('the routing file ../example/subDirectory/routingFile', () => {
        it('should be part of the router', done => {
            router.handle({url: '/subdir', method: 'GET'}, {end: done});
        });
    });

    describe('errorHandler', () => {
        const errors = [];

        before(() => {
            router = routemaster({
                directory: '../example',
                Router: express.Router,
                errorHandler: function (e) {
                    errors.push(e);
                }
            });
        });

        it('is passed errors when attempting to require routing modules', () => {
            assert.equal(errors.length, 1);
            assert.ok(errors[0] instanceof SyntaxError);
        });
    });
});
