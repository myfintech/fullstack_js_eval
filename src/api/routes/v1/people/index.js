const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    database
      .returning('id')
      .insert({first_name: 'Xuan', last_name: 'Schmidt', birthday: '01/01/1970', company: 'MegaCorp Inc', title: 'Rude Bwoy'})
      .into('people')
      .catch((err) => {
          console.error(err)
          res
            .type('json')
            .status(statusCodes.InternalServerError)
            .json({ id: 'unavailable' })
        })
      .then(postPerson => {
          res
            .type('json')
            .status(statusCodes.OK)
            .json({ id: postPerson })
      })
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    database
      .select('id')
      .from('people')
      .where('id', req.params.personID)
      .catch((err) => {
          console.error(err)
          res
            .type('json')
            .status(statusCodes.InternalServerError)
            .json({ result: 'unavailable' })
        })
      .then(getPerson => {
          if(getPerson.length) {
            arrId = [];
            arrId.push(getPerson[0].id)
            res
              .type('json')
              .status(statusCodes.OK)
              .json({id: arrId})
          } else {
            res
              .status(statusCodes.NotFound)
              .end()
          }
      })
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    database
      .select('*')
      .from('people')
      .catch((err) => {
          console.error(err)
          res
            .type('json')
            .status(statusCodes.InternalServerError)
            .json({ result: 'unavailable' })
        })
      .then(getPeople => {
          res
            .type('json')
            .status(statusCodes.OK)
            .send(getPeople)
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
