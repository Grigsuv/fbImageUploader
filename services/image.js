const chokidar = require('chokidar');
const config = require('config');
const fs = require('fs');
const path = require('path');
const isImage = require('is-image');

const lookFolder = path.isAbsolute(config.get("lookFolderPath")) ? path.normalize( config.get("lookFolderPath")) : path.join(__dirname , config.get("lookFolderPath")) ;
const uploadedFolder = path.isAbsolute(config.get("uploadedFolder")) ? path.normalize( config.get("uploadedFolder")) : path.join(__dirname , config.get("uploadedFolder"));
const errorsFolder = path.isAbsolute(config.get("errorsFolder")) ? path.normalize( config.get("errorsFolder")) : path.join(__dirname , config.get("errorsFolder"));;
const ignoreInitial = config.get("ignoreExistingFiles") == 'true';


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


function createReadStream(filePath) {
  return fs.createReadStream(filePath)
}

function moveToErrorFolder(filename) {
  return moveFile(lookFolder + `/${filename}`, errorsFolder + `/${filename}`)
}

function moveToUploadedFolder(filename) {
  return moveFile(lookFolder + `/${filename}`, uploadedFolder + `/${filename}`)
}

function filenameClearer(filepath) {
  filepath = filepath
    .replace(`${lookFolder}`, '')
    .replace(/\\/g, "")
    .replace(/\//g, '');
  return {
    withExtension: filepath,
    withoutExtension: filepath.replace(/\.[^/.]+$/, ""),
  }

}

function moveFile(from, to) {
  fs.rename(from, to, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log('File was moved!!');
    }
  })
}


module.exports = {
  isImage,
  watcher,
  filenameClearer,
  moveToErrorFolder,
  moveToUploadedFolder,
  createReadStream
};
