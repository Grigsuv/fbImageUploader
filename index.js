const chokidar = require('chokidar');
const config = require('config');

const fs = require('fs');
const path = require('path');
const FBService = require('./services/fbService');
const isImage = require('is-image');
const lookFolder = path.normalize(config.get("lookFolderPath"));
const uploadedFolder = path.normalize(config.get("uploadedFolder"));
const errorsFolder = path.normalize(config.get("errorsFolder"));
const ignoreInitial =  config.get("ignoreExistingFiles") == 'true';

const watcher = chokidar.watch(lookFolder, {
  usePolling: true,
  interval: 200,
  cwd: false,
  ignoreInitial: ignoreInitial,
  ignored: /(^|[\/\\])\../,
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 200
  }
});

watcher
  .on('add', filePath => {
    if(!isImage(filePath))
       return;
    FBService.postImage(fs.createReadStream(filePath), filenameClearer(filePath, true), (err, res) => {
     let file = filenameClearer(filePath, false);
      if(err){
        console.log(err);
        console.log(`${filePath} wasn't uploaded`);
        moveFile(lookFolder+`/${file}`,errorsFolder+`/${file}`);
      }else{
        moveFile(lookFolder+`/${file}`, uploadedFolder+`/${file}`);
      }
    })
  })

function filenameClearer(filepath, extension) {
  filepath = filepath
    .replace(`${lookFolder}`, '')
    .replace(/\\/g, "")
    .replace(/\//g, '');
  return extension ? filepath.replace(/\.[^/.]+$/, "") : filepath;
}

function moveFile(from , to) {
  fs.rename(from, to, (err, res) => {
    if(err){
      console.log(err);
    }else{
      console.log('File was uploaded and moved!!');
    }
  })
}