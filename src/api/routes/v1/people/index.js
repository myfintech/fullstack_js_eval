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
      const newPerson = req.body
      await database('people')
        .insert(newPerson)
        .returning('*')
        .then((insertedRecord) => {
          console.log('\n\nInserted Record:\n', insertedRecord)
          /**
           * Database returns record as an array of objects.
           * To respond with just the object, select the first element in this array via insertedRecord[0].
           */
          res
            .status(statusCodes.OK)
            .json(insertedRecord[0])
        })
    } catch (err) {
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .send(err)
    }
  })
  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
      const reqPath = req.path
      const reqParams = req.params
      const personID = reqParams.personID
      console.log('\n\nFull URL: ', fullUrl)
      console.log('URL path: ', reqPath)
      console.log('req.params: ', reqParams)
      console.log('req.params.personID:', personID)
      /**
       * Try to convert personID param string into int value.
       * Error if conversion fails.
       */
      try {
        var personID_int = parseInt(personID)
      } catch (err) {
        console.log(err)
        res
          .status(statusCodes.BadRequest)
          .send('Invalid personID param.\n', err)
      }
      /**
       * If personID param is undefined, return empty object.
       * Else find person in database.
       */
      if (!Number.isInteger(personID_int)) {
        res
          .status(statusCodes.BadRequest)
          .json({
            status: 'Error: undefined or invalid personID'
          })
      } else {
        // Attempt to get person object from database using id
        const retrievedPerson = await database('people')
          .first('*')
          .where({
            id: personID_int
          })
          .whereNull('deleted_at')
        /**
         * If no person with that id exists in database, return 404 not found.
         * Else return found person object and 200 status code.
         */
        console.log('\nRetrieved person:\n', retrievedPerson)
        console.log('Type: ', typeof retrievedPerson)
        if (typeof retrievedPerson !== 'undefined') {
          res
            .status(statusCodes.OK)
            .json(retrievedPerson)
        } else {
          res
            .status(statusCodes.NotFound)
            .json({})
        }
      }
    } catch (err) {
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .send(err)
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
      res
        .status(statusCodes.OK)
        .json(listOfPeople)
    } catch (err) {
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .send(err)
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
      const newAddress = req.body
      await database('addresses')
        .insert(newAddress)
        .returning('*')
        .then((insertedRecord) => {
          console.log('\n\nInserted record:\n', insertedRecord)
          /**
           * Database returns record as an array of objects.
           * To respond with just the object, select the first element in this array via insertedRecord[0].
           */
          res
            .status(statusCodes.OK)
            .json(insertedRecord[0])
        })
    } catch (err) {
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .send(err)
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    try {
      const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
      const reqPath = req.path
      const reqParams = req.params
      const personID = reqParams.personID
      const addressID = reqParams.addressID
      console.log('\n\nFull URL: ', fullUrl)
      console.log('URL path: ', reqPath)
      console.log('req.params: ', reqParams)
      console.log('req.params.personID:', personID)
      console.log('req.params.addressID:', addressID)
      /**
       * Try to convert personID and addressID param strings into int values.
       * Error if conversion fails.
       */
      try {
        var personID_int = parseInt(personID)
        var addressID_int = parseInt(addressID)
      } catch (err) {
        console.log(err)
        res
          .status(statusCodes.BadRequest)
          .send('Invalid personID or addressID param.\n', err)
      }
      /**
       * If personID or addressID params are undefined, return empty object.
       * Else find address in database.
       */
      if (!Number.isInteger(personID_int) || !Number.isInteger(addressID_int)) {
        res
          .status(statusCodes.BadRequest)
          .json({
            status: 'Error: undefined or invalid personID and/or addressID'
          })
      } else {
        // Attempt to get address object from database
        const retrievedAddress = await database('addresses')
          .first('*')
          .where({
            id: addressID_int,
            person_id: personID_int
          })
          .whereNull('deleted_at')
        /**
         * If no person or address with specified ids exist in database, return 404 status code.
         * Else return found address object and 200 status code.
         */
        console.log('\nRetrieved address:\n', retrievedAddress)
        console.log('\nType:', typeof retrievedAddress)
        if (typeof retrievedAddress !== 'undefined' || typeof retrievedAddress.person_id !== 'undefined') {
          res
            .status(statusCodes.OK)
            .json(retrievedAddress)
        } else {
          res
            .status(statusCodes.NotFound)
            .json({})
        }
      }
    } catch (err) {
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .send(err)
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    const personID = req.params.personID
    /**
     * Try to convert personID param string into int value.
     * Error if conversion fails.
     */
    try {
      var personID_int = parseInt(personID)
    } catch (err) {
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .send('Invalid personID param.\n', err)
    }
    try {
      // Get list of all addresses corresponding to specified personID
      const listOfAddresses = await database('addresses')
        .select('*')
        .where({
          person_id: personID_int
        })
        .whereNull('deleted_at')
      console.log('\n\nList of addresses:\n', listOfAddresses)
      res
        .status(statusCodes.OK)
        .json(listOfAddresses)
    } catch (err) {
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .send(err)
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
      const reqParams = req.params
      const personID = reqParams.personID
      const addressID = reqParams.addressID
      /**
       * Try to convert personID and addressID param strings into int values.
       * Error if conversions fail.
       */
      try {
        var personID_int = parseInt(personID)
        var addressID_int = parseInt(addressID)
      } catch (err) {
        console.log(err)
        res
          .status(statusCodes.BadRequest)
          .send('Invalid personID or addressID param.\n', err)
      }
      /**
       * Set deleted_at key to current timestamp (originally NULL).
       * Return alteredRecord that contains new deleted_at timestamp and send in response.
       */
      await database('addresses')
        .select('*')
        .where('id', '=', addressID_int)
        .andWhere('person_id', '=', personID_int)
        .update({
          deleted_at: moment().toISOString()
        })
        .returning('*')
        .then((alteredRecord) => {
          console.log('\n\nRecord with altered deleted_at key:\n', alteredRecord[0])
          res
            .status(statusCodes.OK)
            .json(alteredRecord)
        })
    } catch (err) {
      console.log(err)
      res
        .status(statusCodes.BadRequest)
        .send(err)
    }
  })
}
