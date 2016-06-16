
var RED = require('node-red');
var http = require('http');
var express = require('express');
var settings = require('./settings.json');

var app = express();

server = http.createServer(function(req,res){app(req,res);});

console.log(red);



RED.init(server,settings);

RED.start().then(function() {
    if (settings.httpAdminRoot !== false || settings.httpNodeRoot !== false || settings.httpStatic) {
        server.on('error', function(err) {
            if (err.errno === "EADDRINUSE") {
                RED.log.error(RED.log._("server.unable-to-listen", {listenpath:getListenPath()}));
                RED.log.error(RED.log._("server.port-in-use"));
            } else {
                RED.log.error(RED.log._("server.uncaught-exception"));
                if (err.stack) {
                    RED.log.error(err.stack);
                } else {
                    RED.log.error(err);
                }
            }
            process.exit(1);
        });
        server.listen(settings.uiPort,settings.uiHost,function() {
            if (settings.httpAdminRoot === false) {
                RED.log.info(RED.log._("server.admin-ui-disabled"));
            }
            process.title = 'node-red';
            RED.log.info(RED.log._("server.now-running", {listenpath:getListenPath()}));
        });
    } else {
        RED.log.info(RED.log._("server.headless-mode"));
    }
}).otherwise(function(err) {
    RED.log.error(RED.log._("server.failed-to-start"));
    if (err.stack) {
        RED.log.error(err.stack);
    } else {
        RED.log.error(err);
    }
});


process.on('uncaughtException',function(err) {
    util.log('[red] Uncaught Exception:');
    if (err.stack) {
        util.log(err.stack);
    } else {
        util.log(err);
    }
    process.exit(1);
});

process.on('SIGINT', function () {
    RED.stop();
    // TODO: need to allow nodes to close asynchronously before terminating the
    // process - ie, promises
    process.exit();
});