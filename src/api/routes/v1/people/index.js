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
    // console.log(req)
    const person = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      birthday: req.body.birthday,
      company: req.body.company,
      title: req.body.title
    }
    const personID  = await database('people').insert(person, ['id'])
    // console.log(personID[0])
    person.id = personID[0].id
    // console.log(person)
    res
      .status(statusCodes.OK)
      .json(person)
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    // console.log(req)
    const result = await database('people').select('id', 'first_name', 'last_name', 'company', 'title', 'birthday').where({id: req.params.personID})
    // console.log(result)
    if (result.length > 0){
      const person = result[0]
      person.birthday = moment(person.birthday).format('YYYY-MM-DD')
      res
        .status(statusCodes.OK)
        .json(person)
    } else {
      res
        .status(statusCodes.NotFound)
        .end()
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
     const result = await database('people').select('id', 'first_name', 'last_name', 'company', 'title', 'birthday')
     // console.log(result)
    res
      .status(statusCodes.OK)
      .json(result)
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
    // console.log(req)
    const address = {
      line1: req.body.line1,
      line2: req.body.line2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      person_id: req.params.personID
    }

    try {
      const addressID  = await database('addresses').insert(address, ['id'])
      address.id = addressID[0].id
      res
        .status(statusCodes.OK)
        .json(address)
    }
    catch(err){
      res 
        .status(statusCodes.BadRequest)
        .json(err)
    }
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
