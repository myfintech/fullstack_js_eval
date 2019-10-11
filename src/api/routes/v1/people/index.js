const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      const [newPerson] = await database('people')
        .insert(req.body)
        .returning('*')

      res
        .status(statusCodes.OK)
        .json(newPerson)
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
      const [foundPerson] = await database('people')
        .where('id', Number(req.params.personID))
        .returning('*')

      if (!foundPerson) {
        res.sendStatus(statusCodes.NotFound)
      } else {
        res
          .status(statusCodes.OK)
          .json(foundPerson)
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
      const listOfPeople = await database('people').select()

      res
        .status(statusCodes.OK)
        .json(listOfPeople)
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
      const [newAddress] = await database('addresses')
        .insert({ ...req.body, person_id: Number(req.params.personID) })
        .returning('*')

      res
        .status(statusCodes.OK)
        .json(newAddress)
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
      const [foundAddress] = await database('addresses')
        .where({
          id: Number(req.params.addressID),
          person_id: Number(req.params.personID)
        })

      if (!foundAddress) {
        res.sendStatus(statusCodes.NotFound)
      } else {
        res
          .status(statusCodes.OK)
          .json(foundAddress)
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
      const listOfAddresses = await database('addresses')
        .where({
          person_id: Number(req.params.personID)
        })

      if (!listOfAddresses.length) {
        res.sendStatus(statusCodes.NotFound)
      } else {
        res
          .status(statusCodes.OK)
          .json(listOfAddresses)
      }
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
  api.delete('/:personID/addresses/:addressID', async (req, res) => {
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented)
  })
}
