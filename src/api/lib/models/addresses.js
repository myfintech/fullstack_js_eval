const moment = require('moment');
const { database, tableNames } = require('../database')

const create = (address) => database(tableNames.addresses).insert(address, '*')

const findById = (id) => database(tableNames.addresses)
  .where({ id })
  .whereNull('deleted_at')
  .first('*')

const findByCriteria = (criteria) => database(tableNames.addresses)
  .where(criteria)
  .whereNull('deleted_at')
  .select('*')

const list = () => database(tableNames.addresses)
  .whereNull('deleted_at')
  .orderBy('created_at', 'desc')

const setDeleted = (criteria) => database(tableNames.addresses)
  .where(criteria)
  .update({ deleted_at: moment().toISOString() }, '*')

module.exports = {
  create,
  findById,
  findByCriteria,
  list,
  setDeleted,
}
