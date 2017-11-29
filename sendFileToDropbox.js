/*
 nodejs axios example of send file by put file in HTTP body
 */
const axios = require('axios')
const fs = require('fs')
const filePath = 'index.js'

const inputStream = fs.createReadStream(filePath)
const params = {
  path: '/filename.txt',
  mode: 'add',
  autorename: true,
  mute: false
}
axios.post('https://content.dropboxapi.com/2/files/upload', inputStream, {
  headers: {
    Authorization: `Bearer ${process.env.DROPBOX_TOKEN}`,
    'Dropbox-API-Arg': JSON.stringify(params),
    'content-type': 'application/octet-stream'
  }
})
  .then((response) => {
    console.log('response', response.data)
  })
  .catch((error) => {
    console.log('error', error)
  })
