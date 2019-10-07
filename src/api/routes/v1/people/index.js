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
      const newPerson = await database('people').returning(['id', 'first_name', 'last_name', 'birthday', 'company', 'title', 'created_at', 'updated_at', 'deleted_at'])
      .insert(req.body)
      res
        .json(newPerson[0])
    }
    catch (error) {next(error)}
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res, next) => {
    try {
      const idOfPerson = req.params.personID
      const person = await database('people')
        .where('id', idOfPerson)
      if (person.length){
        res.json(person[0])
      }
      else {
        res.sendStatus(404)
      }
    }
    catch (error) {next(error)}
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res, next) => {
    try {
      const allPeople = await database.select('*')
        .from('people')
      res.json(allPeople)
    }
    catch (error) {next(error)}
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
      const personId = req.params.personID
      const newAddress = await database('addresses').returning(['id', 'person_id', 'line1', 'line2', 'city', 'state', 'zip', 'created_at', 'updated_at', 'deleted_at'])
        .where('person_id', personId)
        .insert(req.body)
      res
        .json(newAddress[0])
    }
    catch (error) {next(error)}
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      const idOfPerson = req.params.personID
      const idOfAddress = req.params.addressID
      const address = await database('addresses').returning(['id', 'person_id', 'line1', 'line2', 'city', 'state', 'zip', 'created_at', 'updated_at', 'deleted_at'])
        // eslint-disable-next-line camelcase
        .where({id: idOfAddress, person_id: idOfPerson})

      res.json(address[0])
    }
    catch (error) {next(error)}
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res, next) => {
    try {
      const personID = req.params.personID
      const allAddresses = await database('addresses').returning(['id', 'person_id', 'line1', 'line2', 'city', 'state', 'zip', 'created_at', 'updated_at', 'deleted_at'])
        .where('person_id', personID)
      res.json(allAddresses)
    }
    catch (error) {next(error)}
  })

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID -- check
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      const idOfPerson = req.params.personID
      const idOfAddress = req.params.addressID
      await database('addresses').where({
        id: idOfAddress,
        // eslint-disable-next-line camelcase
        person_id: idOfPerson
      })
      .del()
      res.json('deleted address')
    }
    catch (error) {next(error)}
  })
}
