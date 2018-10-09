"use strict";
var mapper = require("../../controllers/mapper");
var robo = require("../../controllers/robocopyer");
var stat = require("../../controllers/status");
var Readable = require("stream").Readable;
var kue = require("kue");
const util = require("util");

module.exports = function(app) {
  var queue = kue.createQueue({
    redis:
      "redis://redis-12161.c52.us-east-1-4.ec2.cloud.redislabs.com:12161?password=" +
      process.env.REDIS_PASSWORD
  });
  kue.app.listen(3900);
  queue
    .on("job enqueue", function() {
      console.log("job enqueued");
    })
    .on("job progress", function(id, progress) {
      kue.Job.get(id, function(err, job) {
        console.log(
          "\nJob: " +
            job.id +
            " Progress: " +
            progress +
            " Progress Data: " +
            JSON.stringify(job.progress_data) +
            "\n"
        );
      });
    });

  queue.process("refresh", (job, done) => {
    console.log("Working on job: " + job.id);

    mapper(job)
      .then(function(driveletters) {
        console.log("DriveLetters: " + driveletters);
        job.progress(1, 3, { driveLetters: driveletters });
      })
      .then(function() {
        return robo(job);
      })
      .catch(function(jobErr) {
        done(jobErr);
      })
      .finally(function() {
        done();
      });
  });

  app.route("/").get(function(req, res) {
    res.sendFile(process.cwd() + "/public/index.html");
  });

  app.route("/transferfile").get(function(req, res) {
    let job = queue
      .create("refresh", {
        title: req.query.file,
        source: req.query.source,
        destination: req.query.destination,
        sourceRDN: req.query.sourceRDN,
        destinationRDN: req.query.destinationRDN,
        file: req.query.file,
        status: "pending"
      })
      .save(err => {
        if (err) console.error("enqueue error: " + err);
        res.send({ transferId: job.id });
      });
  });

  app.route("/status").get(function(req, res) {
    let transferId = req.query.transferId;

    let gJob = util.promisify(kue.Job.get);
    gJob(transferId)
      .then(job => {
        let overallProgress = job.toJSON().progress;
        let step = overallProgress === 33 ? "Mounting" : "Transfering";
        let transferPercent =
          overallProgress == 100
            ? 100
            : parseInt(job.toJSON().progress_data.transferPercent);

        let status = { step: step, percent: transferPercent };

        res.send(status);
      })
      .catch(err => {
        console.error("Status Error: " + err);
        res.send({ error: "something went wrong. Please try again." });
      });
  });
};
