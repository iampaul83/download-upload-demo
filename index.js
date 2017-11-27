const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const uploadSingleFile = require('./uploadMiddleware')

const debug = require('debug')('App:index')

// defalut enable DEBUG
if (process.env.NODE_ENV !== 'production' && !process.env.DEBUG) {
  require('debug').enable('App:*')
}

const app = express()

app.use(express.static('public'))

/**
 curl -X POST \
      -F "file=@sendFile.js" \
      http://localhost:8080/upload
 */
app.post('/upload', upload.single('file'), (req, res, next) => {
  debug(req.file)
  res.send('ok')
})

/**
 Headers:

 x-file-name - file name
 content-type - mine type the file

 Example:

 curl -X POST \
      -H "content-type: text/javascript" \
      --data-binary "@sendFile.js" \
      http://localhost:8080/upload-single
 */
app.post('/upload-single', uploadSingleFile, (req, res) => {
  debug(req.file)
  res.send('ok')
})

app.listen(process.env.PORT || 8080)

debug('server is listening on http://0.0.0.0:%s', process.env.PORT || 8080)
