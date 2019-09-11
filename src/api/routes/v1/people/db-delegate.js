const { database } = require('../../../lib/database')

const TABLE_PEOPLE = 'people'
const TABLE_ADDRESSES = 'addresses'

const addPerson = async (req) => {
  return await database(TABLE_PEOPLE)
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      birthday: req.body.birthday,
      company: req.body.company,
      title: req.body.title,
    })
    .returning('*')
}

const getPerson = async (personID) => {
  return await database
    .select()
    .from(TABLE_PEOPLE)
    .where({ 'id': personID })
    .whereNull('deleted_at')
}

const getPeople = async () => {
  return await database
    .select()
    .from(TABLE_PEOPLE)
    .whereNull('deleted_at')
}

const addAddress = async (personID, req) => {
  return await database(TABLE_ADDRESSES)
    .insert({
      person_id: personID,
      line1: req.body.line1,
      line2: req.body.line2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
    })
    .returning('*')
}

const getAddress = async (personID, addressID) => {
  return await database.select()
    .from(TABLE_ADDRESSES)
    .where({ 'person_id': personID, 'id': addressID })
    .whereNull('deleted_at')
}

const getAddresses = async (personID) => {
  return await database.select()
    .from(TABLE_ADDRESSES)
    .where({ 'person_id': personID })
    .whereNull('deleted_at')
}

const deleteAddress = async (personID, addressID) => {
  return await database(TABLE_ADDRESSES)
    .update({ 'deleted_at': new Date().toISOString() })
    .where({ 'person_id': personID, 'id': addressID })
    .whereNull('deleted_at')
    .returning('*')
}

module.exports = {
  addPerson,
  getPerson,
  getPeople,
  addAddress,
  getAddress,
  getAddresses,
  deleteAddress,
}
