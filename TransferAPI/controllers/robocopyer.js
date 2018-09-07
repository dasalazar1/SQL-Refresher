var robocopy = require('robocopy');

module.exports = function(req,res){
  // return new Promise(function(resolve){

  // });
  var source = req.query.source;
  var destination = req.query.destination;
  var sourceRDN = req.query.sourceRDN == 'true';
  var destinationRDN = req.query.destinationRDN == 'true';
  var file = req.query.file;
 
  return robocopy({ source: source,
              destination: destination,
              files: file,
              copy: { restartMode: true },
              logging: {output: {file: 'C:\\Code\\Refresher\\TransferAPI\\public\\robo.log', overwrite: true}}
            });

};