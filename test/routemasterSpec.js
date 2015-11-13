'use strict';

var assert = require('assert');
var express = require('express');
var routemaster = require('../routemaster');

function isExpressRouter(router){
    return typeof router === 'function' &&
        typeof router.get === 'function' &&
        typeof router.handle === 'function' &&
        typeof router.use === 'function';
}

describe('routemaster', function(){
    var router;

    before(function(){
        router = routemaster({
            directory: '../example',
            Router: express.Router
        });
    });

    it('throws if the express.Router option isn\'t passed', function(){
        assert.throws(routemaster, /Routemaster requires express.Router as its Router option/);
    });

    it('throws if the directory option isn\'t passed', function(){
        assert.throws(function(){
            routemaster({ Router: express.Router });
        }, /Routemaster require a directory option/);
    });

    it('returns an Express Router', function(){
        assert.strictEqual(isExpressRouter(router), true);
    });

    describe('the routing file ../example/routingFile', function(){
        it('should be part of the router', function(done){
            router.handle({url: '/', method: 'GET'}, { end: done });
        });
    });

    describe('the routing file ../example/subDirectory/routingFile', function(){
        it('should be part of the router', function(done){
            router.handle({url: '/subdir', method: 'GET'}, { end: done });
        });
    });

    describe('errorHandler', function(){
        var errors = [];

        before(function(){
            router = routemaster({
                directory: '../example',
                Router: express.Router,
                errorHandler: function(e){
                    errors.push(e);
                }
            });
        });

        it('is passed errors when attempting to require routing modules', function(){
            assert.equal(errors.length, 1);
            assert.ok(errors[0] instanceof SyntaxError);
        });
    });
});
