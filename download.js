/*
 nodejs axios example of send file by put file in HTTP body
 */
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const shortid = require('shortid')
const params = {
  path: '/f0fc4f3e70b534452bb9b1f8d95707ca.jpeg'
}
axios.request({
  url: 'https://content.dropboxapi.com/2/files/download',
  responseType: 'stream',
  headers: {
    Authorization: `Bearer ${process.env.DROPBOX_TOKEN}`,
    'Dropbox-API-Arg': JSON.stringify(params)
  }
})
  .then((response) => {
    console.log('result', response.headers['dropbox-api-result'])
    const absoluteFilePath = path.resolve(path.join('uploads/', shortid.generate()))
    // stream.Writable
    const destStream = fs.createWriteStream(absoluteFilePath)
    response.data.pipe(destStream)
    console.log(absoluteFilePath)
  })
  .catch((error) => {
    console.log('error', error)
  })
