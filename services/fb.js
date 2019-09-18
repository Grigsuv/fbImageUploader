const FB = require('fb');
const config = require('config');


const accesstoken = config.get("accessToken");
const albumId = config.get("albumId");

class FBService {
  constructor() {
    FB.setAccessToken(accesstoken);
  }

  postImage(image, imageName, cb) {
    FB.api(`${albumId}/photos/?`, "POST", {
        source: image,
        name:imageName
      },
      function (response) {
        if (response && !response.error) {
          cb(null, response)
        } else {
          cb(response);
        }
      }
    );
  }

}

module.exports = new FBService();