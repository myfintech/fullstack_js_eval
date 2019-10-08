const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')
const moment = require('moment')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    const inserted = await database.insert(req.body)
      .returning('*')
      .into('people')

    return res
      .status(statusCodes.OK)
      .json(inserted[0])
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    const target = await database('people')
      .where({id: req.params.personID})

    if (target[0]) {
      return res
        .status(statusCodes.OK)
        .json(target[0])
    } else {
      return res
        .status(statusCodes.NotFound)
        .json()
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    const people = await database('people');

    return res
      .status(statusCodes.OK)
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
    const inserted = await database
      .insert(Object.assign({}, req.body, {person_id: req.params.personID}))
      .returning('*')
      .into('addresses')

    return res
      .status(statusCodes.OK)
      .json(inserted[0])    
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    const address = await database('addresses')
      .where({id: req.params.addressID})
      .whereNull("deleted_at")

    if (address[0]) {
      return res
        .status(statusCodes.OK)
        .json(address[0])
    } else {
      return res
        .status(statusCodes.NotFound)
        .json()
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    const addresses = await database('addresses')
      .where({person_id: req.params.personID})
      .whereNull("deleted_at");

    return res
      .status(statusCodes.OK)
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
    const address = await database('addresses')
      .where({ id: req.params.addressID })
      .update({ deleted_at: moment().toISOString() })
      .returning('*')

    if (address[0]) {
      return res
        .status(statusCodes.OK)
        .json(address)
    } else {
      return res
        .status(statusCodes.NotFound)
        .json()
    }
  })
}
