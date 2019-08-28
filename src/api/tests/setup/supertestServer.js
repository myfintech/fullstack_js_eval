const supertest = require('supertest')
const { database } = require('../../lib/database')
const { createServer } = require('../../server')

const server = createServer()
const httpServer = server.listen(0)
const client = supertest(server)

function stopServer () {
  return new Promise((resolve) => {
    httpServer.close(resolve)
  })
}

async function shutdown () {
  await stopServer()
  await database.client.destroy()
}

module.exports = {
  client, server, shutdown
}
