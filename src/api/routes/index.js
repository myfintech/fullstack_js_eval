const { database } = require('../lib/database')

module.exports = (api) => {
  api.get('/', (req, res) => {
    res.json({
      server: 'MANTL fullstack javascript backend'
    })
  })

  api.get('/health', async (req, res) => {
    const { count } = await database.first(database.raw('1+1 AS count'))
    res.json({ ok: count === 2 })
  })
}
