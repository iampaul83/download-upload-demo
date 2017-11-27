const path = require('path')
const fs = require('fs')
const shortid = require('shortid')
const debug = require('debug')('App:uploadMiddleware')

module.exports = (req, res, next) => {
  const absoluteFilePath = path.resolve(path.join('uploads/', shortid.generate()))
  // stream.Writable
  const destStream = fs.createWriteStream(absoluteFilePath)

  // connection closed
  req.on('aborted', onAborted)
  req.on('close', onAborted)
  // finish upload
  req.on('end', onEnd)
  // error
  req.on('error', onAborted)

  // write file
  req.pipe(destStream)

  let complete = false

  function onAborted () {
    if (complete) return
    complete = true

    debug('onAborted')

    // end stream
    destStream.destroy()
    // delete file
    fs.unlink(absoluteFilePath, (error) => {
      debug('unable to delete file %s, error: %s', absoluteFilePath, error.message)
    })

    cleanup()

    res.sendStatus(500)
  }

  function onEnd () {
    debug('onEnd (success)')
    req.file = {
      originalname: req.get('x-file-name'),
      mimetype: req.get('content-type'),
      path: absoluteFilePath
    }
    cleanup()
    next()
  }

  function cleanup () {
    debug('cleanup')
    req.removeListener('aborted', onAborted)
    req.removeListener('close', onAborted)
    req.removeListener('end', onEnd)
    req.removeListener('error', onAborted)
  }
}
