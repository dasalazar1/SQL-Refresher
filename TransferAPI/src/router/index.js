'use strict';
var mapper = require('../../controllers/mapper');
var robo = require('../../controllers/robocopyer');
var stat = require('../../controllers/status');
var Readable = require('stream').Readable;
var delay = require('delay');


module.exports = function (app) {

  app.route('/')
    .get(function (req, res) {
        res.sendFile(process.cwd() + '/public/index.html');
    });

  app.route('/transferfile')
    .get(function(req, res){

      var s = new Readable();
      s._read = () => {}; 
      s.pipe(res);
      s.pipe(process.stdout);

      mapper(req,res)
      .then(result => {s.push('all mounted\n'); })
      .then(() => { 
        return robo(req,res)
      })
      .then(result => {s.push('File moved\n'); s.push(null) })
      .catch(err => s.push(err.message));
    });

  app.route('/status')
    .get(function(req,res){

      stat(req,res);
      
    });

};
