const statusCodes = require('../../../lib/httpStatusCodes');
const httpErrorMessages = require('../../../lib/httpErrorMessages');
const { database } = require('../../../lib/database');

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      const { first_name, last_name, birthday, company, title } = req.body;
      const data = await database('people').insert({
        first_name,
        last_name,
        birthday,
        company,
        title
      }, '*');
      res.status(200).json(data[0]);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res, next) => {
    try {
      const personID = req.params.personID;
      const data = await database('people').where('id', personID);
      if (!data[0]) res.status(404).send('that person was not found.');
      res.status(200).json(data[0]);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res, next) => {
    try {
      const data = await database('people').select('*');
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
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
  api.post('/:personID/addresses', async (req, res, next) => {
    try {
      const { personID } = req.params;
      const { line1, line2, city, state, zip } = req.body;
      const data = await database('addresses')
        .insert({ line1, line2, city, state, zip, person_id: personID })
        .returning('*');
      res.status(200).json(data[0]);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      const data = await database('addresses')
        .where({
          id: req.params.addressID,
          person_id: req.params.personID,
        })
        .whereNull('deleted_at');
      if (!data[0]) res.status(404).send('Not Found');
      res.status(200).json(data[0]);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res, next) => {
    try {
      const data = await database('addresses')
        .where('person_id', req.params.personID)
        .whereNull('deleted_at');
      if (!data.length) res.status(404).send('Not found.');
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      await database('addresses')
        .where({
          id: req.params.addressID,
          deleted_at: null
        })
        .update({
          deleted_at: moment().toISOString()
        });
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  });
};
