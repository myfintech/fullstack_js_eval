const statusCodes = require('../../../lib/httpStatusCodes');
const httpErrorMessages = require('../../../lib/httpErrorMessages');
const { database } = require('../../../lib/database');
const moment = require('moment');

module.exports = api => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      const {
        first_name,
        last_name,
        title,
        company,
        birthday,
        created_at
      } = req.body;
      const [newPerson] = await database('people')
        .returning('*')
        .insert({
          first_name,
          last_name,
          title,
          company,
          birthday,
          created_at
        });
      res.status(statusCodes.OK).json(newPerson);
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
      const personId = req.params.personID;

      const [selectedPerson] = await database
        .select()
        .from('people')
        .where({ id: personId });

      if (!selectedPerson) {
        res.sendStatus(statusCodes.NotFound);
      }
      res.status(statusCodes.OK).json(selectedPerson);
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
      const allPeople = await database.select().from('people');
      res.status(statusCodes.OK).json(allPeople);
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
      const { line1, line2, city, state, zip, created_at } = req.body;
      const person_id = req.params.personID;
      const [newAddress] = await database('addresses')
        .returning('*')
        .insert({
          line1,
          line2,
          city,
          state,
          zip,
          person_id,
          created_at
        });

      res.status(statusCodes.OK).json(newAddress);
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
      const addressId = req.params.addressID;
      const personId = req.params.personID;
      const [selectedAddress] = await database
        .select()
        .from('addresses')
        .where({ id: addressId, person_id: personId, deleted_at: null });
      if (!selectedAddress) {
        res.sendStatus(statusCodes.NotFound);
      }
      res.status(statusCodes.OK).json(selectedAddress);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    try {
      const personId = req.params.personID;
      const addresses = await database
        .select()
        .from('addresses')
        .where({ person_id: personId, deleted_at: null });

      res.status(statusCodes.OK).json(addresses);
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
  api.delete('/:personID/addresses/:addressID', async (req, res) => {
    try {
      const addressId = req.params.addressID;
      const personId = req.params.personID;
      const now = moment().toISOString();
      const [deletedAddress] = await database('addresses')
        .where({ id: addressId, person_id: personId })
        .update({ deleted_at: now }, ['*']);
      res.status(statusCodes.OK).json(deletedAddress);
    } catch (error) {
      next(error);
    }
  });
};
