const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const moment = require('moment')
const { database } = require('../../../lib/database')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      let newPerson = await database('people').insert(req.body).returning('*')
      res
        .status(statusCodes.OK)
        .json(newPerson[0])
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res, next) => {
    try {
      const people = await database('people').select().where({
        id: req.params.personID
      })
      if (people.length > 0) {
        res
        .status(statusCodes.OK)
        .json(people[0])
      } else {
        res
        .status(statusCodes.NotFound)
        .json('That person was not found')
      }
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res, next) => {
    try {
      const people = await database('people').select()
      res
        .status(statusCodes.OK)
        .json(people)
    } catch (error) {
      next(error)
    }
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
  api.post('/:personID/addresses', async (req, res, next) => {
    try {
      const address = req.body
      address.person_id = req.params.personID
      let newAddress = await database('addresses').insert(address).returning('*')
      res
        .status(statusCodes.OK)
        .json(newAddress[0])
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      const foundAddress = await database('addresses').select().where({
        id: req.params.addressID,
        person_id: req.params.personID,
        deleted_at: null
      })
      if (foundAddress.length > 0) {
        res
        .status(statusCodes.OK)
        .json(foundAddress[0])
      } else {
        res
        .status(statusCodes.NotFound)
        .json('That address was not found')
      }
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res, next) => {
    try {
      const foundAddress = await database('addresses').select().where({
        person_id: req.params.personID,
        deleted_at: null
      })
      res
        .status(statusCodes.OK)
        .json(foundAddress)
    } catch (error) {
      next(error)
    }
  })

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      const deletedAddress = await database('addresses').where({
        id: req.params.addressID,
        person_id: req.params.personID
      })
      .update({
          deleted_at: moment().toISOString(),
      })
      .returning('*')
      res
        .status(statusCodes.OK)
        .json(deletedAddress[0])
    } catch (error) {
      next(error)
    }
  })
}
