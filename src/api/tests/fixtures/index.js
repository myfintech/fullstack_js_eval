const faker = require('faker')
const moment = require('moment')
const peopleSchema = require('./people_schema')
const addressesSchema = require('./addresses_schema')

const contentTypes = {
  json: 'application/json; charset=utf-8'
}

const passingRootServerResponse = {
  server: 'MANTL fullstack javascript backend'
}

const passingHealthCheckResponse = {
  ok: true
}

const firstPerson = {
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  title: faker.name.jobTitle(),
  company: faker.company.companyName(),
  birthday: moment(faker.date.between('01-01-1985', '01-01-2000')).format('YYYY-MM-DD'),
  created_at: moment().toISOString()
}

const firstAddress = {
  person_id: '1',
  line1: '92 Brooklyn St',
  line2: 'Appt 2',
  city: 'Brooklyn',
  state: 'NY',
  zip: '21394',
  created_at: moment().toISOString()
}

module.exports = {
  contentTypes,
  firstPerson,
  firstAddress,
  peopleSchema,
  addressesSchema,
  passingRootServerResponse,
  passingHealthCheckResponse,
  dataContainer: {}
}
