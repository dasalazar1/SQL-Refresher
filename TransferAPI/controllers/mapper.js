var networkDrive = require('windows-network-drive');
//var Readable = require('stream').Readable;



module.exports = function(job){
    var source = job.data.source;
    var destination = job.data.destination;
    var sourceRDN = job.data.sourceRDN == 'true';
    var destinationRDN = job.data.destinationRDN == 'true';

    var sourceMouted = findAndMountDrive(job, source, 
                                          sourceRDN ? process.env.RDN_USER : undefined,
                                          sourceRDN ? process.env.RDN_PASSWORD : undefined );
    var destMounted = findAndMountDrive(job, destination, 
                                          destinationRDN ? process.env.RDN_USER : undefined,
                                          destinationRDN ? process.env.RDN_PASSWORD : undefined );

    return Promise.all([sourceMouted, destMounted]);
}

function findAndMountDrive(job, path, username, password){
  return new Promise(function(resolve, reject){
    job.log("finding: " + path + "\n");
    networkDrive.find(path)
    .then(function(driveLetter){
      if(driveLetter.length == 0)
      {
          networkDrive.mount(path, undefined, username, password)
          .then(function(driveletter2){
            resolve(driveletter2)
          })
          .catch(function(error){
            job.log(error)
            reject(error)
          })
      }
      else
      {
        job.log("Path already mounted: " + path + "\n");
        resolve(driveLetter);
      }
    })
  })
}