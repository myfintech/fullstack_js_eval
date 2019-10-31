const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    const person = req.body

    database('people').insert(person, 'id')
      .then(person => {
        res
          .type('application/json')
          .status(200)
          .json({ id: person[0] })
      })
      .catch(error => {
        res
          .status(500)
          .json({ error })
      })
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    database('people').where('id', req.params.personID).select()
      .then(person => {
        if(person.length) {
          res
            .type('application/json')
            .status(200)
            .json({id: person[0].id})
        } else {
          res
            .status(404)
            .json({ error })
        }
      })
      .catch(error => {
        res
          .status(404)
          .json({ error })
      })
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    database('people').select()
      .then((people)=> {
        res
        .type('application/json')
        .status(200)
        .json(people)
      })
      .catch((error) => {
        res.status(404).json({ error })
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
    const address = req.body

    database('addresses').where('person_id', req.params.personID).insert(address, 'id')
      .then(address => {
        res
          .type('application/json')
          .status(200)
          .json({ id: address[0] })
      })
      .catch(error => {
        res
          .status(500)
          .json({ error })
      })
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    database('addresses').where('person_id', req.params.personID).select('id')
      .then(address => {
        if(address.length) {
          res
            .type('application/json')
            .status(200)
            .json({id: address[0].id})
        } else {
          res
            .status(404)
            .json({ error })
        }
      })
      .catch(error => {
        res
          .status(404)
          .json({ error })
      })
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    database('addresses').where('person_id', req.params.personID).select()
      .then((addresses)=> {
        res
        .type('application/json')
        .status(200)
        .json(addresses)
      })
      .catch((error) => {
        res.status(404).json({ error })
      })
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
