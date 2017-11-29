const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const uploadSingleFile = require('./uploadMiddleware')
const bodyParser = require('body-parser')
const path = require('path')
const contentDisposition = require('content-disposition')
const axios = require('axios')
const DropboxStroage = require('./DropboxStorage')
const debug = require('debug')('App:index')

// defalut enable DEBUG
if (process.env.NODE_ENV !== 'production' && !process.env.DEBUG) {
  require('debug').enable('App:*')
}

if (!process.env.DROPBOX_TOKEN) {
  debug('NO DROPBOX_TOKEN')
  throw new Error('NO DROPBOX_TOKEN')
}

const app = express()

app.use(express.static('public'))

app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'public/download.html')

  // res.set('Content-Disposition', 'attachment')
  // res.header('Content-Disposition', contentDisposition(filePath))

  // magic to disable express send 304 status
  res.setHeader('Last-Modified', (new Date()).toUTCString())
  res.sendFile(filePath)
})

/**
 curl -X POST \
      -F "file=@sendFile.js" \
      http://localhost:8080/upload
 */
app.post('/upload', upload.single('file'), (req, res, next) => {
  debug(req.file)
  debug(req.body)
  res.send('ok')
})

const uploadToDropbox = multer({ storage: DropboxStroage({ oauthToken: process.env.DROPBOX_TOKEN }) })
app.post('/upload/dropbox', uploadToDropbox.single('file'), (req, res, next) => {
  debug(req.file)
  debug(req.body)
  res.send('ok')
})

/**
 Headers:

 x-file-name - file name
 content-type - mine type the file

 Example:

 curl -X POST \
      -H "content-type: text/javascript" \
      -H "x-file-name: sendFile.js" \
      --data-binary "@sendFile.js" \
      http://localhost:8080/upload-single
 */
app.post('/upload-single', uploadSingleFile, (req, res) => {
  debug(req.file)
  res.send('ok')
})

/**

 curl -X POST \
      -H "content-type: application/json" \
      --data-binary "@test.json" \
      http://localhost:8080/rest/api

 */
app.post('/rest/api', bodyParser.json(), function (req, res) {
  const log = require('debug')('App:index:/rest/api')
  log('%O', req.body)
  res.json({
    status: 200,
    message: 'hello'
  })
})

/**

 curl -X POST \
      -H "content-type: application/json" \
      --data-binary "@test.json" \
      http://localhost:8080/rest/api

 */
app.post('/urlencoded', bodyParser.urlencoded({ extended: true }), function (req, res) {
  const log = require('debug')('App:index:/urlencoded')
  log('%O', req.body)
  res.json({
    status: 200,
    message: 'hello'
  })
})

app.post('/dropbox', bodyParser.urlencoded({ extended: true }), (req, res) => {
  debug(req.body.path)
  const params = {
    path: req.body.path
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
      // stream.Writable
      response.data.pipe(res)
    })
    .catch((error) => {
      console.log('error', error)
      res.sendStatus(500)
    })
})

app.listen(process.env.PORT || 8080)

debug('server is listening on http://0.0.0.0:%s', process.env.PORT || 8080)
