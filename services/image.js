const chokidar = require('chokidar');
const config = require('config');

const fs = require('fs');
const path = require('path');
const isImage = require('is-image');
const lookFolder = path.normalize(config.get("lookFolderPath"));
const uploadedFolder = path.normalize(config.get("uploadedFolder"));
const errorsFolder = path.normalize(config.get("errorsFolder"));
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

module.exports = {
  isImage,
  watcher,
  filenameClearer,
  moveToErrorFolder,
  moveToUploadedFolder,
  createReadStrem
};

function createReadStrem(filePath) {
  return fs.createReadStream(filePath)
}

function moveToErrorFolder(filename) {
  return moveFile(lookFolder + `/${file}`, errorsFolder + `/${file}`)
}

function moveToUploadedFolder(filename) {
  return moveFile(lookFolder + `/${file}`, uploadedFolder + `/${file}`)
}

function filenameClearer(filepath) {
  filepath = filepath
    .replace(`${lookFolder}`, '')
    .replace(/\\/g, "")
    .replace(/\//g, '');
  return {
    withExtension : filepath,
    withoutExtension:  filepath.replace(/\.[^/.]+$/, ""),
  }
  
}

function moveFile(file, from = lookFolder + `/${file}`) {
  fs.rename(from, to, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log('File was uploaded and moved!!');
    }
  })
}