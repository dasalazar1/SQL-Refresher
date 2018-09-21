'use strict';
var mapper = require('../../controllers/mapper');
var robo = require('../../controllers/robocopyer');
var stat = require('../../controllers/status');
var Readable = require('stream').Readable;
var delay = require('delay');
var kue = require('kue');

module.exports = function (app) {

  var queue = kue.createQueue({redis: 'redis://redis-12161.c52.us-east-1-4.ec2.cloud.redislabs.com:12161?password=' + process.env.REDIS_PASSWORD});
  kue.app.listen(3900);
  queue.on('job enqueue', function(){
    console.log('job enqueued');
  })

  queue.process('refresh',(job, done) => {
    console.log('Working on job: ' + job.id);
    job.data.status = 'In Process';

    mapper(job)
      .then(function(driveletters){
        console.log('DriveLetters: ' + driveletters)
      })
      .catch(function(indexErr){
        if (indexErr)
          console.log("index error: " + indexErr.message)
        else
          console.log('no errors');  
      });
      // .then(result => {s.push('all mounted\n'); })
      // .then(() => {return robo(req,res)})
      // .then(result => {s.push('File moved\n'); s.push(null) })
      // .catch(err => s.push("index error: " + err.message));

  });

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

      var job = queue.create('refresh', 
      {
        title: req.query.file,
        source: req.query.source,
        destination: req.query.destination,
        sourceRDN: req.query.sourceRDN,
        destinationRDN: req.query.destinationRDN,
        file: req.query.file, 
        status: 'pending'
      }).save(err => {
        if (err) 
          s.push("enqueue error: " + err) 
        s.push(job.id.toString());
        s.push(null);
      });
    });

  app.route('/status')
    .get(function(req,res){

      stat(req,res);
      
    });

};
