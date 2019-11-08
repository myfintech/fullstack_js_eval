const fixtures = require('./fixtures')
const httpStatusCodes = require('../lib/httpStatusCodes')
const { client } = require('./setup/supertestServer')
const { expect } = require('chai')
const moment = require('moment')

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

  it('GET /v1/people/:personID should return a 200 with an object of the person with that id', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}`)
      .expect(httpStatusCodes.OK, fixtures.firstPerson)
  })

  it('GET /v1/people/:personID should return a 404 when an incorrect id is used', async () => {
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
      .post(`/v1/people/${fixtures.firstPerson.id}/addresses`)
      .send({
        line1: '37 W 28th St',
        line2: 'Floor 10',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        created_at: moment().toISOString()
      })
      .expect('Content-Type', fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        fixtures.firstAddress = resp.body
        expect(resp.body.person_id).to.equal(fixtures.firstPerson.id)
        expect(resp.body.line1).to.equal('37 W 28th St')
        expect(resp.body.line2).to.equal('Floor 10')
        expect(resp.body.city).to.equal('New York')
        expect(resp.body.state).to.equal('NY')
        expect(resp.body.zip).to.equal('10001')
      })
  })

  it('GET /v1/people/:personID/addresses/:addressID should return an address by its id and its person_id', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}/addresses/${fixtures.firstAddress.id}`)
      .expect('Content-Type', fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK, fixtures.firstAddress)
  })

  // Additional Test
  it('GET /v1/people/:personID/addresses/:addressID should return a 404 when an incorrect address id is used', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}/addresses/99999999`)
      .expect(httpStatusCodes.NotFound)
  })

  // Additional Test
  it('GET /v1/people/:personID/addresses/:addressID should return a 404 when an incorrect person id is used', async () => {
    await client
      .get(`/v1/people/99999999/addresses/${fixtures.firstAddress.id}`)
      .expect(httpStatusCodes.NotFound)
  })

  it('GET /v1/people/:personID/addresses should return a list of addresses belonging to the person by that id', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}/addresses`)
      .expect('Content-Type', fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        expect(resp.body).to.have.lengthOf.above(0)
      })
  })

  // Additional Test
  it('GET /v1/people/:personID/addresses should return a 404 when no addresses are found belonging to the person by that id', async () => {
    await client
      .get('/v1/people/99999999/addresses')
      .expect(httpStatusCodes.NotFound)
  })

  // BONUS!!!
  it('DELETE /v1/people/:personID/addresses/:addressID should delete an address by its id (BONUS)', async () => {
    await client
      .delete(`/v1/people/${fixtures.firstPerson.id}/addresses/${fixtures.firstAddress.id}`)
      .expect(httpStatusCodes.NoContent)
  })
})
