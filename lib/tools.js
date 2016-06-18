/**
 *
 */

const basicAuth = require('basic-auth');


module.exports = {
    basicAuthMiddleware : basicAuthMiddleware
};


/**
 *
 */
function basicAuthMiddleware(credentials) {

    console.log('    allowed: ', credentials);

    return function(req,res,next) {
        if (req.method === 'OPTIONS') {
            return next();
        }
        var requestUser = basicAuth(req);
        if (!requestUser || !credentials[requestUser.name] || requestUser.pass !== credentials[requestUser.name] ) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            return res.sendStatus(401);
        }
        req.user = {
            name: credentials[requestUser.name]
        };
        next();
    }
}