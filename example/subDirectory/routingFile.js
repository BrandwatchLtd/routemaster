'use strict';

function getSubdir(req, res){
    res.end();
}

module.exports = function(router){
    router.get('/subdir', getSubdir);
    return router;
};