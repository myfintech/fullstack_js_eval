const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')
const moment = require('moment')
const peopleDao = require('../../../dao/peopleDao')
const peopleAdapters = require('../../../adapters/peopleAdapters')

module.exports = (api) => {
  const People = () => database('people')
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    return peopleDao.Insert(req.body)
    .then(data => {
      return res.status(statusCodes.OK).json(peopleAdapters.fromReqBodyWithId(data, req.body))
    })
    .catch(e => {
      return res.status(statusCodes.InternalServerError).json({})
    })
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {

    const personId = req.params['personID']

    return People()
    .select()
    .where('id', personId)
    .then(data => {
      const results = peopleAdapters.fromListOfDbModelsToApiModels(data)
      if (results.length === 1) {
        return res.status(statusCodes.OK).json(results[0])
      }
      return res.status(statusCodes.NotFound).json(null)
    })
    .catch(e => {
      return res.status(statusCodes.InternalServerError).json({}) // Todo, real error reponses
    })

  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {

    return People()
    .select()
    .then(data => {
      return res.status(statusCodes.OK).json([...data])
    })
    .catch(e => {
      return res.status(statusCodes.InternalServerError).json({})
    })
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
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented)
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented)
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented)
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
