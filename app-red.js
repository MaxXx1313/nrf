/**
 *
 */


const express = require('express');
const tools = require('./lib/tools.js');

const users = require('./users.json');

var port = process.env.PORT || 8080;
var uid = process.env.RED_UID;
var attemptsLimit = process.env.RED_P_LIMIT || 15;
var timeoutSec = process.env.TIMEOUT || 10;

var _timer = null;
function _trackActivity(){
  _timer && clearTimeout(_timer);
  _timer = setTimeout(_quitTimeout, timeoutSec*1000);
}

function _quitTimeout(){
  process.exit(1003);
}



// fake red
var app = express();
var credentials = {};
credentials[uid] = users[uid];


app.use((req,res,next)=>{
  _trackActivity();
  next();
});

app.use(tools.basicAuthMiddleware(credentials)); // single user :)

app.use((req, res, next)=>{
  console.log('red[%s]\t%s\t%s', uid, req.method.toUpperCase(), req.url);
  next();
});

app.get('/', (req,res)=>{
  res.send('Hi '+req.user.name+'! <br> This is node-red!');
});



_startServer(port, attemptsLimit, function(err, server){
  if(!err){
    console.log('red[%s]\tServer started at %s:%s', uid, server.address().address, server.address().port);
    _trackActivity();
    process.send( server.address() );
  }else{
    console.log('err', err);
    process.exit(1002);
  }
});
///////////


function _startServer(port, attemptsLimit, cb){
    port = port*1;

    if(attemptsLimit<0){
      cb({reason:'Attempts run out'});
      return null;
    }

    var server = app.listen(port, function(){
      cb(null, server);
    });
    server.on('error', err=>{
      if(err.errno==='EADDRINUSE'){
        console.log(' port %s is busy', port);
        _startServer(port+1, attemptsLimit-1, cb);
      }else{
        cb(err);
      }
    });
    return server;

 }