const statusCodes = require('../../../lib/httpStatusCodes');
const httpErrorMessages = require('../../../lib/httpErrorMessages');
const { database } = require('../../../lib/database');

module.exports = api => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      const data = await database('people').insert(req.body, '*');
      res.status(200).json(data[0]);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      const data = await database('people').where('id', req.params.personID);
      if (!data[0]) throw new Error('not found');
      res.status(200).json(data[0]);
    } catch (error) {
      res.status(404).send(error.message);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    const data = await database.select('*').from('people');
    res.status(200).json(data);
  });

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
      .json(httpErrorMessages.NotImplemented);
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented);
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented);
  });

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
      .json(httpErrorMessages.NotImplemented);
  });
};
