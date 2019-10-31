const { database, tableNames } = require('../database')

const create = (person) => database(tableNames.people).insert(person, '*')

const findById = (id) => database(tableNames.people)
  .where({ id })
  .whereNull('deleted_at')
  .first('*')

const list = () => database(tableNames.people)
  .whereNull('deleted_at')
  .orderBy('created_at', 'desc')

module.exports = {
  create,
  findById,
  list
}
