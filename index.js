const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const multer = require('koa-multer')
const static = require('koa-static')
const path = require('path')

const debug = require('debug')('KoaApp:index')

// defalut enable DEBUG
if (process.env.NODE_ENV !== 'production' && !process.env.DEBUG) {
    require('debug').enable('KoaApp:*')
}

const app = new Koa()
const upload = multer({ dest: 'uploads/' });

app.use(static('public'))

app.use(bodyParser(), (ctx, next) => {
    ctx.input = ctx.request.body
    next()
})

const router = new Router()
router.post('/upload', upload.single('file'), async (ctx, next) => {
    console.log(ctx.req.file)
    ctx.body = 'hello'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(process.env.PORT || 8080)

debug('server is listening on http://0.0.0.0:%s', process.env.PORT || 8080)
