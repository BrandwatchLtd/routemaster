'use strict';

var assert = require('assert');
var path = require('path');
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

    describe('when passed a Router instead of a router', function(){
        before(function(){
            router = routemaster({
                directory: '../example',
                Router: express.Router
            });
        });

        it('throws if the express.Router option isn\'t passed', function(){
            assert.throws(routemaster, /Routemaster requires a Router constructor or a router option/);
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
            it('is part of the router', function(done){
                router.handle({url: '/', method: 'GET'}, { end: done });
            });
        });

        describe('the routing file ../example/subDirectory/routingFile', function(){
            it('is part of the router', function(done){
                router.handle({url: '/subdir', method: 'GET'}, { end: done });
            });
        });
    });

    describe('when passed a router instead of a Router', function(){
        var newRouter;

        before(function(){
            newRouter = new express.Router();

            router = routemaster({
                directory: '../example',
                router: newRouter
            });
        });

        it('throws if the directory option isn\'t passed', function(){
            assert.throws(function(){
                routemaster({ router: newRouter });
            }, /Routemaster require a directory option/);
        });

        it('returns the passed router', function(){
            assert.strictEqual(router, newRouter);
        });

        describe('the routing file ../example/routingFile', function(){
            it('is part of the router', function(done){
                router.handle({url: '/', method: 'GET'}, { end: done });
            });
        });

        describe('the routing file ../example/subDirectory/routingFile', function(){
            it('is part of the router', function(done){
                router.handle({url: '/subdir', method: 'GET'}, { end: done });
            });
        });
    });

    describe('errorHandler', function(){
        var errors;
        var descriptions;

        before(function(){
            errors = [];
            descriptions = [];

            router = routemaster({
                directory: '../example',
                Router: express.Router,
                errorHandler: function(e, desc){
                    errors.push(e);
                    descriptions.push(desc);
                }
            });
        });

        describe('when requiring a routing module fails', function(){
            it('is passed an error', function(){
                assert.equal(errors.length, 1);
                assert.ok(errors[0] instanceof SyntaxError);
            });

            it('is passed a description', function(){
                var filePath = path.resolve(__dirname, '../example/notARoutingFile.dummy');

                assert.equal(descriptions.length, 1);
                assert.strictEqual(descriptions[0], 'Could not append routing file ' + filePath);
            });
        });
    });
});
