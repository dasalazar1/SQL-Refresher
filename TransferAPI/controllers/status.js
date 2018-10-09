var fs = require('fs');
var readLastLines = require('read-last-lines');

module.exports = function(req,res){

  readLastLines.read('C:\\Code\\Refresher\\TransferAPI\\public\\robo.log', 1)
    .then((line) => {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write('{"status": "' + line.trim() + '"}');
      res.end();
      
    })


};