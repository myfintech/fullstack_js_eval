const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')

module.exports = api => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    const newPerson = await database('people')
      .insert(req.body)
      .returning('*')
    res
      .type('application/json')
      .status(200)
      .json(newPerson[0])
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    const { personID } = req.params
    const person = await database('people')
      .where({ id: personID, deleted_at: null })
      .select('*')
    if (person.length) {
      res
        .type('application/json')
        .status(200)
        .json(person[0])
    } else {
      res.status(404).send()
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    const people = await database('people')
      .whereNull('deleted_at')
      .select('*')
    res
      .type('application/json')
      .status(200)
      .json(people)
  })

  /**
   * Do not modify beyond this point until you have reached
   * TDD / BDD Mocha.js / Chai.js
   * ======================================================
   * ======================================================
   */

  /**
   * POST /v1/people/:personID/addresses
   * Create a new address belonging to a person
   **/
  api.post('/:personID/addresses', async (req, res) => {
    const newAddress = await database('addresses')
      .insert({ ...req.body, person_id: req.params.personID })
      .returning('*')
    res
      .type('application/json')
      .status(200)
      .json(newAddress[0])
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    const { personID, addressID } = req.params
    const address = await database('addresses')
      .where({ id: addressID, person_id: personID, deleted_at: null })
      .select('*')
    if (address.length) {
      res
        .type('application/json')
        .status(200)
        .json(address[0])
    } else {
      res.status(404).send()
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    const addresses = await database('addresses')
      .where({ person_id: req.params.personID, deleted_at: null })
      .select('*')
    res
      .type('application/json')
      .status(200)
      .json(addresses)
  })

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res) => {
    const { personID, addressID } = req.params
    const deletedAddress = await database('addresses')
      .where({ person_id: personID, id: addressID })
      .update({ deleted_at: database.fn.now() })
      .returning('*')
    res
      .type('application/json')
      .status(200)
      .json(deletedAddress[0])
  })
}