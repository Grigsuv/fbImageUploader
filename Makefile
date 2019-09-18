build:
	lookUpFolder=$(python -mjson.tool config/default.json | grep lookFolderPath)
	uploadedFolder=$(python -mjson.tool config/default.json | grep lookFolderPath)
	errorsFolder=$(python -mjson.tool config/default.json | grep lookFolderPath)
	mkdir -p files uploadedFiles uploadErorrFiles