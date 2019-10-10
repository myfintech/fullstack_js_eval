const knex = require('knex')

const database = knex({
  client: 'pg',
  connection: {
    port: 5432,
    user: 'mantl',
    password: 'mantl',
    hostname: 'postgres',
    database: 'mantl'
  }
})

const tableNames = {
  people: 'people',
  addresses: 'addresses',
}


module.exports = {
  database,
  knex,
  tableNames
}
