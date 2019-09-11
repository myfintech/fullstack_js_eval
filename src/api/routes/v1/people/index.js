const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const dbDelegate = require('./db-delegate');

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res) => {
    const response = await dbDelegate.addPerson(req)
      .catch(() => {
        return res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      })

    return res
      .status(statusCodes.OK)
      .json(response[0])
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    const { personID } = req.params;
    const response = await dbDelegate.getPerson(personID)
      .catch(() => {
        return res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      })

    if (response.length > 0) {
      return res
        .status(statusCodes.OK)
        .json(response[0])
    }

    return res
      .status(statusCodes.NotFound)
      .json()
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    const response = await dbDelegate.getPeople()
      .catch(() => {
        return res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      })

    return res
      .status(statusCodes.OK)
      .json(response)
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
    const { personID } = req.params;
    const response = await dbDelegate.addAddress(personID, req)
      .catch(() => {
        return res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      })

    return res
      .status(statusCodes.OK)
      .json(response[0])
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    const { personID, addressID } = req.params;
    const response = await dbDelegate.getAddress(personID, addressID)
      .catch(() => {
        return res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      })

    if (response.length > 0) {
      return res
        .status(statusCodes.OK)
        .json(response[0])
    }

    return res
      .status(statusCodes.NotFound)
      .json()
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    const { personID } = req.params
    const response = await dbDelegate.getAddresses(personID)
      .catch(() => {
        return res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      })

    return res
      .status(statusCodes.OK)
      .json(response)
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
    const response = await dbDelegate.deleteAddress(personID, addressID)
      .catch(() => {
        return res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      })

    if (response.length > 0) {
      return res
        .status(statusCodes.OK)
        .json(response[0])
    }

    return res
      .status(statusCodes.NotFound)
      .json()
  })
}
