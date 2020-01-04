const fixtures = require('./fixtures')
const httpStatusCodes = require('../lib/httpStatusCodes')
const { client } = require('./setup/supertestServer')
const { expect } = require('chai')

function hasPersonKeys (res) {
  const keys = ['first_name', 'last_name', 'company', 'created_at', 'id', 'title']
  keys.map(key => { if (!res.body[key]) throw new Error(`Response missing ${key}`) })
}

describe('People API', () => {
  it('POST /v1/people should create a new person', async () => {
    await client
      .post('/v1/people')
      .send(fixtures.firstPerson)
      .expect(httpStatusCodes.OK)
      .expect(hasPersonKeys)
      .then(resp => {
        fixtures.firstPerson = resp.body
      })
  })

  xit('GET /v1/people/:personID should return a 200 with an object of the person with that id', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}`)
      .expect(httpStatusCodes.OK, fixtures.firstPerson)
  })

  xit('GET /v1/people/:personID should return a 404 when an incorrect id is used', async () => {
    await client
      .get(`/v1/people/99999999`)
      .expect(httpStatusCodes.NotFound)
  })

  it('GET /v1/people should return a 200 with an array of people objects', async () => {
    await client
      .get('/v1/people')
      .expect('Content-Type', fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        expect(resp.body).to.have.lengthOf.above(0)
      })
  })

  /**
   * Do not modify above this line (use them as a reference point)
   * Do not modify beyond this point until you have reached
   * TDD / BDD Mocha.js / Chai.js
   * ======================================================
   * ======================================================
   */

  it('POST /v1/people/:personID/addresses should create a new address', async () => {
    await client
      .post('//:personID/addresses')
      .send(fixtures.firstPerson.id.addresses)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        fixtures.firstPerson.id.addresses = resp.body
      })
    })

  it('GET /v1/people/:personID/addresses/:addressID should return an address by its id and its person_id' , async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id.addresses.id}`)
      .expect(httpStatusCodes.OK, fixtures.firstPerson)
  })

  it('GET /v1/people/:personID/addresses should return a list of addresses belonging to the person by that id' , async () => {
    await client
      .get('/v1/people/:personID/addresses')
      .expect('Content-Type', fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        expect(resp.body).to.have.lengthOf.above(0)
      })
  })

  // BONUS!!!
  it('DELETE /v1/people/:personID/addresses/:addressID should delete an address by its id (BONUS)')
})
