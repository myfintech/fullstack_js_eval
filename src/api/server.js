const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const enrouten = require('express-enrouten')
const { join } = require('path')

const parserOptions = { extended: true }

function createServer ({ requestLogging } = {}) {
  const api = express()

  // log incoming requests
  if (requestLogging) {
    api.use((req, res, next) => {
      console.log(JSON.stringify({
        method: req.method,
        url: req.url,
        agent: req.headers['user-agent']
      }))
      next()
    })
  }

  /**
   * parse incoming HTTP requests
   * URL encoded parameters are accessible on req.query <Object>
   * JSON post bodies are accessible on req.body <Object>
   * https://www.npmjs.com/package/body-parser
   */
  api.use(bodyParser.json(parserOptions))
  api.use(bodyParser.urlencoded(parserOptions))

  /**
   * parse HTTP Cookie header
   * they are accessible under req.cookies <Object>
   * https://www.npmjs.com/package/cookie-parser
   */
  api.use(cookieParser())

  /**
   * register controllers under the routes directory
   * any file that exports a single function signature will be loaded
   * the API server will be injected as a dependency to these controller functions.
   * module.exports = (api) => {
   *   // GET /
   *   api.get('/', (req, res) => {
   *     res.json({ ok: true })
   *   })
   * }
   */

  api.use(enrouten({
    directory: join(__dirname, 'routes')
  }))

  api.all('*', (req, res) => {
    res.status(404).json({
      message: 'not found'
    })
  })

  api.use((error, req, res, next) => {
    if(!error.httpStatusCode){
      res.status(500).json({
        error
      })
    }
    res.status(error.httpStatusCode).json({
      error
    })
  })


  return api
}

module.exports = {
  createServer
}
