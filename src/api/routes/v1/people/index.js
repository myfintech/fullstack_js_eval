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
    try {
      // Get new person info from request body
      const newPerson = req.body
      // Attempt to insert new person info into database
      const [insertedRecord] = await database('people')
        .insert(newPerson)
        .returning('*')
      // Respond with record that was inserted into the database + the id given to it after insertion
      res
        .status(statusCodes.OK)
        .json(insertedRecord)
    } catch (err) {
      // Log error for debugging; respond with error and 400 status code
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .json({
          error: err
        })
    }
  })
  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      /**
       * Attempt to get person record from database using id.
       * Catch case when no record in database.
       */
      const retrievedPerson = await database('people')
        .first('*')
        .where({
          id: req.params.personID
        })
        .whereNull('deleted_at')
      /**
       * If no person record with the specified personID exists in database,
       * respond with error object and 404 status code.
       * Else respond with found person record as object and 200 status code.
       */
      if (!retrievedPerson) {
        // Respond with empty object because no record found
        res
          .status(statusCodes.NotFound)
          .json({
            error: `No record found for specified personID<${req.params.personID}>.`
          })
      }
      // Respond with person record of given id that was retrieved from database
      res
        .status(statusCodes.OK)
        .json(retrievedPerson)
    } catch (err) {
      // Log error for debugging; respond with error and 400 status code
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .json({
          error: err
        })
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      // Get list of all people records in database
      const listOfPeople = await database()
        .select('*')
        .from('people')
      /**
       * Respond with list of all people records stored in database.
       * If no records found, response will be an empty array.
       */
      res
        .status(statusCodes.OK)
        .json(listOfPeople)
    } catch (err) {
      // Log error for debugging; respond with error and 400 status code
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .json({
          error: err
        })
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
  api.post('/:personID/addresses', async (req, res) => {
    try {
      // Retrieve new address info from request body
      const newAddress = req.body
      // Attempt to insert new address record into database
      const [insertedRecord] = await database('addresses')
        .insert(newAddress)
        .returning('*')
      // Respond with inserted address record (which is an array of objects) corresponding to given personID
      res
        .status(statusCodes.OK)
        .json(insertedRecord)
    } catch (err) {
      // Log error for debug; respond with error
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .json({
          error: err
        })
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    try {
      /**
       * Attempt to get address object from database.
       * Catch case where record doesn't exist.
       */
      const retrievedAddress = await database('addresses')
        .first('*')
        .where({
          id: req.params.addressID,
          person_id: req.params.personID
        })
        .whereNull('deleted_at')
      /**
       * If no address record with the specified IDs exists in database,
       * respond with error object and 404 status code.
       * Else respond with record as object and 200 status code.
       */
      if (!retrievedAddress) {
        // Respond with empty object because no record found
        res
          .status(statusCodes.NotFound)
          .json({
            error: `No record found for specified personID<${req.params.personID}> addressID<${req.params.addressID}>.`
          })
      }
      // Respond with address object corresponding to given addressID and personID
      res
        .status(statusCodes.OK)
        .json(retrievedAddress)
    } catch (err) {
      // Log error for debugging; respond with error and 400 status code
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .json({
          error: err
        })
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    try {
      // Get list of all addresses corresponding to specified personID
      const listOfAddresses = await database('addresses')
        .select('*')
        .where({
          person_id: req.params.personID
        })
        .whereNull('deleted_at')
      /**
       * If no address record with the specified personID exists in database,
       * respond with error object and 404 status code.
       * Else respond with found address record as object and 200 status code.
       */
      if (!listOfAddresses) {
        // Respond with empty object because no record found
        res
          .status(statusCodes.NotFound)
          .json({
            error: `No record found for specified personID<${req.params.personID}>.`
          })
      }
      // Respond with all address records contained in database corresponding to given personID as an array of objects
      res
        .status(statusCodes.OK)
        .json(listOfAddresses)
    } catch (err) {
      // Log error for debugging; respond with error and 400 status code
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .json({
          error: err
        })
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
    try {
      /**
       * Set deleted_at key to current timestamp (originally NULL).
       * Return alteredRecord that contains new deleted_at timestamp and send in response.
       * Catch case where record doesn't exist.
       */
      const [alteredRecord] = await database('addresses')
        .select('*')
        .where('id', '=', req.params.addressID)
        .andWhere('person_id', '=', req.params.personID)
        .update({
          deleted_at: moment().toISOString()
        })
        .returning('*')
      /**
       * If no address record with the specified IDs exists in database,
       * respond with error object and 404 status code.
       * Else respond with found person record as object and 200 status code.
       */
      if (!alteredRecord) {
        // Respond with empty object because no record found
        res
          .status(statusCodes.NotFound)
          .json({
            error: `No record found for specified personID<${req.params.personID}> addressID<${req.params.addressID}>.`
          })
      }
      // Respond with updated record info including change made to deleted_at
      res
        .status(statusCodes.OK)
        .json(alteredRecord)
    } catch (err) {
      // Log error for debugging; respond with error and 400 status code
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .json({
          error: err
        })
    }
  })
}
