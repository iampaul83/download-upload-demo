const axios = require('axios')

function MyCustomStorage ({ oauthToken }) {
  if (!oauthToken) {
    throw Error('no oauthToken')
  }
  this.token = oauthToken
}

MyCustomStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  const params = {
    path: `/${file.originalname}`,
    mode: 'add',
    autorename: true,
    mute: false
  }
  axios.post('https://content.dropboxapi.com/2/files/upload', file.stream, {
    headers: {
      Authorization: `Bearer ${this.token}`,
      'Dropbox-API-Arg': JSON.stringify(params),
      'content-type': 'application/octet-stream'
    }
  })
    .then((response) => {
      cb()
      console.log('response', response.data)
    })
    .catch((error) => {
      cb(error)
      console.log('error', error)
    })
}

MyCustomStorage.prototype._removeFile = function _removeFile (req, file, cb) {
  console.log('remove file')
  cb()
  // fs.unlink(file.path, cb)
}

module.exports = function (opts) {
  return new MyCustomStorage(opts)
}
