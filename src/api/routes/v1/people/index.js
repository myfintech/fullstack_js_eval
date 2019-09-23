// absolute imports
const moment = require('moment');

// relative imports
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
      const records = await database('people')
        .insert(req.body)
        .returning('*');

      const savedRecord = records[0];
      res
        .status(statusCodes.OK)
        .json(savedRecord);
    } catch (err) {
      res
      .status(statusCodes.InternalServerError)
      .json(err);
    }
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      const {
        personID: person_id,
      } = req.params;
      const record = await database('people')
        .where({ id: req.params.personID })
        .first();
      if (!record) {
        throw new Error(`No record found for id ${person_id}`);
      }
      res
        .status(statusCodes.OK)
        .type('application/json')
        .json(record);
    } catch (err) {
      res
        .status(statusCodes.NotFound)
        .json();
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      const records = await database('people')
        .select('*');
      res
        .status(statusCodes.OK)
        .type('application/json')
        .json(records);
    } catch (err) {
      res
        .status(statusCodes.InternalServerError)
        .json();
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
      const {
        personID: person_id,
      } = req.params;

      const records = await database('addresses')
        .insert({
          person_id,
          ...req.body
        })
        .returning('*');
      const savedRecord = records[0];
      res
        .status(statusCodes.OK)
        .json(savedRecord);
    } catch (err) {
      res
        .status(statusCodes.InternalServerError)
        .json(err);
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    try {
      const {
        addressID: id,
        personID: person_id,
      } = req.params;

      const record = await database('addresses')
        .where({
          id,
          person_id,
          deleted_at: null,
        })
        .first();

        if (!record) {
          throw new Error(`No record found for person_id ${person_id} / id ${id}`);
        }
      res
        .status(statusCodes.OK)
        .type('application/json')
        .json(record);
    } catch (err) {
      res
        .status(statusCodes.NotFound)
        .json();
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    const {
      personID: person_id,
    } = req.params;
    database('addresses')
    .select('*')
    .where({
      person_id,
      deleted_at: null,
    })
    .then(result => {
      res
      .status(statusCodes.OK)
      .type('application/json')
      .json(result);
    })
    .catch(_ => {
      res
      .status(statusCodes.InternalServerError)
    });
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
      const {
        addressID: id,
        personID: person_id,
      } = req.params;
      await database('addresses')
        .where({
          id,
          person_id,
        })
        .update({
          deleted_at: moment().format(),
        });
      res
        .status(statusCodes.OK)
        .type('application/json')
        .json();
    } catch (err) {
      res
        .status(statusCodes.InternalServerError)
    }
  })
}
