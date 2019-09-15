const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    const results = await database('people')
      .returning(['id', 'first_name', 'last_name',
                  'title', 'company', 'birthday', 'created_at'])
      .insert({
        first_name: req.body.first_name,
        last_name:  req.body.last_name,
        title:      req.body.title,
        company:    req.body.company,
        birthday:   req.body.birthday,
        created_at: req.body.created_at
      })
    if (results.length > 0) {
      res.status(200).send(results[0])
    } else {
      const err = new Error('Unable to add new person');
      err.statusCode = 500;
      next(err);
    }
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res, next) => {
    const results = await database('people')
      .select(['id', 'first_name', 'last_name',
              'title', 'company', 'birthday', 'created_at'])
      .where({ id: req.params.personID })
    if (results.length > 0) {
      res.status(200).send(results[0])
    } else {
      const err = new Error('Person not found');
      err.statusCode = 404;
      next(err);
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    const results = await database('people')
      .select(['id', 'first_name', 'last_name',
              'title', 'company', 'birthday', 'created_at'])
    if (results.length > 0) {
      res.status(200).send(results)
    } else {
      const err = new Error('People not found');
      err.statusCode = 404;
      next(err);
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

  api.use((err, req, res, next) => {
    console.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
  })
}
