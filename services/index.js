const FBService = require('./fb');
const { createReadStream, filenameClearer, isImage, moveToUploadedFolder, moveToErrorFolder, watcher } = require('./image');

watcher
    .on('add', filePath => {
        if (!isImage(filePath))
            return;
        let fileName = filenameClearer(filePath)
        FBService.postImage(createReadStream(filePath), fileName.withExtension, (err, res) => {
            if (err) {
                console.log(err);
                console.log(`${filePath} wasn't uploaded`);
                moveToErrorFolder(fileName.withoutExtension);
            } else {
                moveToUploadedFolder(fileName.withoutExtension);
            }
        })
    })

module.exports = watcher;