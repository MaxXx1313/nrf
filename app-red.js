/**
 *
 */


const express = require('express');
const tools = require('./lib/tools.js');

const users = require('./users.json');

var port = process.env.PORT || 8080;
var uid = process.env.RED_UID;




// fake red
var app = express();
var credentials = {};
credentials[uid] = users[uid];
app.use(tools.basicAuthMiddleware(credentials)); // single user :)

app.use((req, res, next)=>{
  console.log('red[%s]\t%s\t%s', uid, req.method.toUpperCase(), req.url);
  next();
});

app.get('/', (req,res)=>{
  res.send('Hi '+req.user.name+'! <br> This is node-red!');
});



///////////
var server = app.listen(port, ()=>{
  console.log('red[%s]\tServer started at %s:%s', uid, server.address().address, server.address().port);
  process.send( server.address() );
});