'use strict';

var path = require('path');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');

function isExpressRouter(router){
    expect(typeof router).toEqual('function');
    expect(typeof router.get).toEqual('function');
    expect(typeof router.handle).toEqual('function');
    expect(typeof router.use).toEqual('function');
}

describe('routemaster', function(){
    var routemaster;
    var router;
    var example1Spy;
    var example2Spy;

    function getRoutingFileSpies(){
        var requires = {};
        var example1 = path.resolve(__dirname, '../example/routingFile');
        var example2 = path.resolve(__dirname, '../example/subDirectory/routingFile');

        requires[example1] = example1Spy = sinon.spy(require(example1));
        requires[example2] = example2Spy = sinon.spy(require(example2));

        return requires;
    }

    before(function(){
        routemaster = SandboxedModule.require('../routemaster', {
            requires: getRoutingFileSpies()
        });
        router = routemaster('../example');
    });

    it('returns an Express Router', function(){
        isExpressRouter(router);
    });

    it('provides each routing file with a new Express Router', function(){
        isExpressRouter(example1Spy.args[0][0]);
        isExpressRouter(example2Spy.args[0][0]);
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
});