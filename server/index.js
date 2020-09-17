const Koa = require('koa');
const cors = require('kcors')
const log = require('./logger')
const api = require('./api')

const app = new Koa();
const port = process.env.PORT || 5000

// apply CORS config
const origin = process.env.CORS_ORIGIN | '*'
app.use(cors({ origin }))

// response
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    log.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
  // Error Handler - All uncaught exceptions will percolate up to here
app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
      log.error(`Request Error ${ctx.url} - ${err.message}`)
    }
  })

  // Mount routes
app.use(api.routes(), api.allowedMethods())

// Start the app
app.listen(port, () => { log.info(`Server listening at port ${port}`) })
