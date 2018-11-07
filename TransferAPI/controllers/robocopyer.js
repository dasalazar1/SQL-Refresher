var robocopy = require("robocopy");
var Tail = require("tail").Tail;
var readLastLines = require("read-last-lines");

module.exports = function(job) {
  var source = job.data.source;
  var destination = job.data.destination;
  var file = job.data.file;

  var roboPromise = robocopy({
    source: source,
    destination: destination,
    files: file,
    copy: {
      /*restartMode: true*/
    },
    retry: { count: 2, wait: 10 },
    logging: { output: { file: "C:\\Code\\Refresher\\TransferAPI\\public\\" + job.id + ".log", overwrite: true } }
  });

  var watcherPromise = new Promise(function(resolve, reject) {
    var reg = /([0-9 \.]*%)(?!\s*[0-9 \.]*%)|Ended/;
    var regEnd = /100%|Ended/;
    var regError = /Error:/;
    var interval = setInterval(() => {
      readLastLines
        .read("C:\\Code\\Refresher\\TransferAPI\\public\\" + job.id + ".log", 10)
        .then(line => {
          var match = reg.exec(line);
          job.progress(2, 3, { transferPercent: match ? match[0] : "no data" });

          if (regEnd.test(line)) {
            clearInterval(interval);
            resolve("transfer done");
          }

          if (regError.test(line)) {
            clearInterval(interval);
            resolve("Error:");
          }
        })
        .catch(function(error) {
          clearInterval(interval);
          reject(error);
        });
    }, 3000);
  });

  return Promise.all([roboPromise, watcherPromise]);
};
