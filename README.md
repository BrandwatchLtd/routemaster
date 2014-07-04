Routemaster
==========

Routemaster, a tiny [Router][router] builder for your [Express][express] applications. Provide it with a directory and Routemaster will recurse through it and return an amalgamated router of the result.

#### Your routing files

In the directory you provide to Routemaster, there should be at least one file that looks like this:

```js
module.exports = function(router){
  return router;
};
```

This is a routing file, which is basically just something that returns a function which accepts a router and returns that same router. Just add your routes to the router in the body.

Feel free to create as many of these files as you like, in as many sub directories as you like; each one is just added to the amalgamated router via `Router.use`.

#### Using with your Express application

Once you have a directory with a few routing files, simply require Routemaster where you define your Express `app` and invoke `app.use` on it like so.

```js
var routemaster = require('routemaster');
var express = require('express');
var app = express();

app.use(routemaster('./routes'));

app.listen(3000);
```

That's about it, PRs accepted.

[router]: http://expressjs.com/4x/api.html#router
[express]: http://expressjs.com/
