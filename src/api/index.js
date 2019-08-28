const { createServer } = require('./server')
const { PORT = 3000 } = process.env

const server = createServer({
  requestLogging: true
})

server.listen(PORT, (err) => {
  if (err) {
    console.error('failed to start', err)
    process.exit(1)
  }

  console.log(`API server is listening on ${PORT}`)
})
