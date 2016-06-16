
var settings = require('./node_modules/node-red/settings.js')

var extra =  {

   "uiPort": 1881,

   "flowFile": "flows.json",
   "userDir" : "./flow/",
   "verbose" : true
}

for (var name in extra){
  settings[name] = extra[name];
}



module.exports = settings;