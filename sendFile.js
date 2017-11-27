/*
 nodejs axios example of send file by put file in HTTP body
 */
const axios = require('axios')
const fs = require('fs')
const mime = require('mime-types')
const path = require('path')
const filePath = 'index.js'
const inputStream = fs.createReadStream(filePath)
axios.post('http://localhost:8080/upload-single', inputStream, {
  headers: {
    'content-type': mime.lookup(filePath) || 'application/octet-stream',
    'x-file-name': path.basename(filePath)
  }
})
  .then((response) => {
    console.log('response', response.data)
  })
  .catch((error) => {
    console.log('error', error)
  })
