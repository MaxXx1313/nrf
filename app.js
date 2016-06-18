/**
 *
 */
const child_process = require('child_process');

const express = require('express');
const tools = require('./lib/tools.js');

const users = require('./users.json');

var port = process.env.PORT || 8080;


var app = express();
app.use(tools.basicAuthMiddleware(users));

app.use((req, res, next)=>{
  console.log('%s\t%s', req.method.toUpperCase(), req.url);
  next();
});

app.get('/', (req,res)=>{
  res.send('Hi '+req.user.name+'! <br> <a href="/red">Open node red</a>');
});


app.get('/red', (req,res)=>{
  runRed(req.user.name).then(port=>{
    res.send('Your instance here: <a href="http://127.0.0.1:'+port+'" terget="_blank">Open node red('+port+')</a>');
  }).catch(err=>{
    res.status(500).send(""+err);
  });
});



///////////
var server = app.listen(port, ()=>{
  console.log('Server started at %s:%s', server.address().address, server.address().port);
});

/////////////////////////////////////////////////////////////////////////////////////////////


/**
 *
 */
function runRed(uid){
  return new Promise((resolve, reject)=>{
    const child = child_process.fork('app-red.js', [], {
      env:{
        PORT:port,
        RED_UID:uid
      },
      // silent: true
    });

    // child.stdout.on('data', (data) => {
    //   console.log(`stdout[${uid}]: ${data}`);
    // });

    // child.stderr.on('data', (data) => {
    //   console.log(`stderr[${uid}]: ${data}`);
    // });

    child.on('message', (m) => {
      console.log('PARENT got message:', m);
      resolve(m.port);
    });

    child.on('close', (code) => {
      var err = `child process [${uid}] exited with code ${code}`;
      console.log(err);
      reject(err);
    });

  });

}

