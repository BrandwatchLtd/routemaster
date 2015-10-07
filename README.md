Routemaster
==========

Routemaster, a tiny [Router][router] builder for your [Express][express] applications. Provide it with a directory and Routemaster will recurse through it and return an amalgamated router of the result.

#### Your routing files

In the directory you provide to Routemaster, there should be at least one file that looks like this:

```js
module.exports = function(router){
  // do stuff with the router
};
```

This is a routing file, which is basically just something that returns a function which accepts a router. Just add your routes to the router in the body. The router is passed by reference, so don't worry about returning it.

Feel free to create as many of these files as you like, in as many sub directories as you like; each one is just added to the amalgamated router via `Router.use`.

#### Using with your Express application

Once you have a directory with a few routing files, simply require Routemaster where you define your Express `app` and invoke `app.use` on it like so.

```js
var routemaster = require('routemaster');
var express = require('express');
var app = express();

app.use(routemaster({
    directory: './routes',
    Router: express.Router
}));

app.listen(3000);
```

Both the `directory` and `Router` options are **required**.

Please take careful notice that `Router` start with an uppercase "R" and should be the `express.Router` constructor, _not_ an instantiated Router.

The `directory` parameter is simply the directory through which you wish to recurse.

That's about it, PRs accepted.

#### options

| option | required | description |
| ------ | -------- | ----------- |
| directory | yes | A directory containing modules with routes. May also contain subdirectories with routes modules and so forth. |
| Router | yes | Use `express.Router` here. This allows Routemaster to be agnostic to express version. |
| errorHandler | no | When given, errors thrown when attempting to require a routes module will be passed to this function. Useful for logging. When not given, errors are ignored. |

[router]: http://expressjs.com/4x/api.html#router
[express]: http://expressjs.com/
