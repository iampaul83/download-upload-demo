/*
 nodejs axios example of send file by put file in HTTP body
 */
const axios = require('axios')
const fs = require('fs')
const mime = require('mime-types')
const path = require('path')
const filePath = 'index.js'

const FormData = require('form-data');

const inputStream = fs.createReadStream(filePath)
const form = new FormData()
form.append('file', inputStream)

axios.post('http://localhost:8080/upload', form, {
  headers: form.getHeaders() // 'content-type': 'multipart/form-data; boundary=--------------------------xxxxxxxxxxxxxxx'
})
  .then((response) => {
    console.log('response', response.data)
  })
  .catch((error) => {
    console.log('error', error.message)
  })
