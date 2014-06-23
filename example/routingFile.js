'use strict';

function getIndex(req, res){
    res.end();
}

module.exports = function(router){
    router.get('/', getIndex);
    return router;
};