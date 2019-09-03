const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')
const moment = require('moment')

// Pre-declarations for vars used to store request info
let FULL_URL = ''
let REQ_PATH = ''
let REQ_PARAMS = ''
let PERSON_ID = ''
let ADDRESS_ID = ''

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      // Get, update, and log new request info
      processNewReqInfo(
        req.protocol,
        req.get('host'),
        req.originalUrl,
        req.path,
        req.params,
        req.params.personID,
        req.params.addressID
      )
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
      // Get, update, and log new request info
      processNewReqInfo(
        req.protocol,
        req.get('host'),
        req.originalUrl,
        req.path,
        req.params,
        req.params.personID,
        req.params.addressID
      )
      /**
       * Attempt to get person object from database using id.
       * Catch case when no record in database.
       */
      const retrievedPerson = await database('people')
        .first('*')
        .where({
          id: PERSON_ID
        })
        .whereNull('deleted_at')
      /**
       * If no person with that id exists in database, return 404 not found.
       * Else return found person object and 200 status code.
       */
      if (typeof retrievedPerson !== 'undefined') {
        // Respond with person record of given id that was retrieved from database
        res
          .status(statusCodes.OK)
          .json(retrievedPerson)
      } else {
        // Respond with empty object because no person record corresponding to given id was found in database
        res
          .status(statusCodes.NotFound)
          .json({})
      }
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
      // Get, update, and log new request info
      processNewReqInfo(
        req.protocol,
        req.get('host'),
        req.originalUrl,
        req.path,
        req.params,
        req.params.personID,
        req.params.addressID
      )
      // Get list of all people records in database
      const listOfPeople = await database()
        .select('*')
        .from('people')
      // Respond with list of all people objects stored in database
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
      // Get, update, and log new request info
      processNewReqInfo(
        req.protocol,
        req.get('host'),
        req.originalUrl,
        req.path,
        req.params,
        req.params.personID,
        req.params.addressID
      )
      // Retrieve new address info from request body
      const newAddress = req.body
      // Attempt to insert new address info into database
      const [insertedRecord] = await database('addresses')
        .insert(newAddress)
        .returning('*')
      // Respond with address record (which is an array of objects) corresponding to given personID
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
      // Get, update, and log new request info
      processNewReqInfo(
        req.protocol,
        req.get('host'),
        req.originalUrl,
        req.path,
        req.params,
        req.params.personID,
        req.params.addressID
      )
      // Attempt to get address object from database
      const retrievedAddress = await database('addresses')
        .first('*')
        .where({
          id: ADDRESS_ID,
          person_id: PERSON_ID
        })
        .whereNull('deleted_at')
      /**
       * If no person or address with specified ids exist in database, return empty object and 404 status code.
       * Else return found address object and 200 status code.
       */
      if (typeof retrievedAddress !== 'undefined' || typeof retrievedAddress.person_id !== 'undefined') {
        // Respond with address object corresponding to given addressID and personID
        res
          .status(statusCodes.OK)
          .json(retrievedAddress)
      } else {
        // Respond with empty object because no record found
        res
          .status(statusCodes.NotFound)
          .json({})
      }
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
      // Get, update, and log new request info
      processNewReqInfo(
        req.protocol,
        req.get('host'),
        req.originalUrl,
        req.path,
        req.params,
        req.params.personID,
        req.params.addressID
      )
      // Get list of all addresses corresponding to specified personID
      const listOfAddresses = await database('addresses')
        .select('*')
        .where({
          person_id: PERSON_ID
        })
        .whereNull('deleted_at')
      // Respond with all address records contained in database corresponding to given personID
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
      // Get, update, and log new request info
      processNewReqInfo(
        req.protocol,
        req.get('host'),
        req.originalUrl,
        req.path,
        req.params,
        req.params.personID,
        req.params.addressID
      )
      /**
       * Set deleted_at key to current timestamp (originally NULL).
       * Return alteredRecord that contains new deleted_at timestamp and send in response.
       */
      const [alteredRecord] = await database('addresses')
        .select('*')
        .where('id', '=', ADDRESS_ID)
        .andWhere('person_id', '=', PERSON_ID)
        .update({
          deleted_at: moment().toISOString()
        })
        .returning('*')
      // Respond with full record info including change made to deleted_at
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

/*
Gets information from HTTP request, saves to local vars, and logs (if necessary)
*/
const processNewReqInfo = (protocol, host, originalURL, path, params, pID, aID) => {
  // Update info
  FULL_URL = protocol + '://' + host + originalURL
  REQ_PATH = path
  REQ_PARAMS = params
  PERSON_ID = pID
  ADDRESS_ID = aID
  // Log info
  /*
  console.log(
    '\n\n',
    'Full URL:', FULL_URL,
    '\n',
    'API Path:', REQ_PATH,
    '\n',
    'req.params:', REQ_PARAMS,
    '\n',
    'req.params.personID:', PERSON_ID,
    '\n',
    'req.params.addressID:', ADDRESS_ID,
    '\n'
  )
  */
}
