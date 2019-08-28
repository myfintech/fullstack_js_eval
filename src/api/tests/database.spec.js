const fixtures = require('./fixtures')
const { database } = require('../lib/database')
const { expect } = require('chai')

async function getFKConstraintsForTable (table) {
  return database.first('*').from('information_schema.table_constraints').where({
    table_name: table,
    constraint_type: 'FOREIGN KEY',
    table_schema: 'public'
  }).limit(1)
}

async function getSchemaForTable (table) {
  return database.select([
    'table_catalog as database_name',
    'table_name as table_name',
    'column_name as column_name',
    'column_default as default_value',
    'data_type as data_type',
    'character_maximum_length as column_length'
  ]).from('information_schema.columns').where({
    table_name: table,
    table_schema: 'public'
  }).orderBy('table_name')
}

describe('Database schema', () => {
  it('Should have a correctly structured people table in the public schema', async () => {
    expect(await getSchemaForTable('people')).to.be.deep.equal(fixtures.peopleSchema)
  })

  it('Should have a correctly structured addresses table in the public schema', async () => {
    expect(await getSchemaForTable('addresses')).to.be.deep.equal(fixtures.addressesSchema.structure)
    expect(await getFKConstraintsForTable('addresses')).to.be.deep.equal(fixtures.addressesSchema.foreignKey)
  })
})
