const fixtures = require('./fixtures')
const httpStatusCodes = require('../lib/httpStatusCodes')
const { client } = require('./setup/supertestServer')
const { expect } = require('chai')

describe('People API', () => {
  it('POST /v1/people should create a new person', async () => {
    await client
      .post('/v1/people')
      .send(fixtures.firstPerson)
      .expect(httpStatusCodes.OK)
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
      .send(fixtures.newAddress)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        expect(resp.body.person_id).to.equal(fixtures.firstPerson.id),
          expect(resp.body.line1).to.equal(fixtures.newAddress.line1),
          fixtures.newAddress = resp.body;
      })
  })

  it('GET /v1/people/:personID/addresses/:addressID should return an address by its id and its person_id', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}/addresses/${fixtures.newAddress.id}`)
      .expect(httpStatusCodes.OK)
      .expect('Content-Type', fixtures.contentTypes.json)
      .then(resp => {
        expect(resp.body.person_id).to.equal(fixtures.firstPerson.id)
      })
  })

  it('GET /v1/people/:personID/addresses/:addressID should return a 404 when an incorrect personID is used', async () => {
    await client
      .get(`/v1/people/20/addresses/${fixtures.newAddress.id}`)
      .expect(httpStatusCodes.NotFound)
  })

  it('GET /v1/people/:personID/addresses/:addressID should return a 404 when an incorrect addressID is used', async () => {
    await client
      .get(`/v1/people/${fixtures.firstPerson.id}/addresses/9999999`)
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

  // BONUS!!!
  it('DELETE /v1/people/:personID/addresses/:addressID should delete an address by its id (BONUS)', async () => {
    await client
      .delete(`/v1/people/${fixtures.firstPerson.id}/addresses/${fixtures.newAddress.id}`)
      .expect('Content-Type', fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        expect(resp.body.deleted_at).to.be.not.null
      })
  })
})
