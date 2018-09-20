var networkDrive = require('windows-network-drive');
var Readable = require('stream').Readable;



module.exports = function(req,res){

  var source = req.query.source;
  var destination = req.query.destination;
  var sourceRDN = req.query.sourceRDN == 'true';
  var destinationRDN = req.query.destinationRDN == 'true';

  var s = new Readable();
  s._read = () => {}; 
  s.pipe(res);
  s.pipe(process.stdout);

  var sourceMouted = findAndMountDrive(s, source, 
                                        sourceRDN ? process.env.RDN_USER : undefined,
                                        sourceRDN ? process.env.RDN_PASSWORD : undefined )
  var destMounted = findAndMountDrive(s, destination, 
                                        destinationRDN ? process.env.RDN_USER : undefined,
                                        destinationRDN ? process.env.RDN_PASSWORD : undefined )

  return Promise.all([sourceMouted, destMounted]);
  
}

function findAndMountDrive(stream, path, username, password){
  return new Promise(function(resolve){

    stream.push("finding: " + path + "\n");
    networkDrive.find(path)
    .then(function(driveLetter){
      if(driveLetter.length == 0)
      {
        networkDrive.mount(path, undefined, username, password)
          .then(function(driveLetter2){
            stream.push("done: " + path + "\n");
            resolve(driveLetter2);
          });
      }
      else
      {
        stream.push("Path already mounted: " + path + "\n");
        resolve(driveLetter);
      }
    })
    .catch(err => s.push("mapper find and mount error: " + err.message));;
  });
};