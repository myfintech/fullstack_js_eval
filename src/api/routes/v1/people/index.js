const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database');
const moment = require('moment');

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      const [person] = await database('people').insert(req.body).returning('*')
      return res.status(statusCodes.OK).json(person);
    } catch (e) {
      return res.sendStatus(statusCodes.InternalServerError);
    }
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      const [person] = await database('people').where('id', req.params.personID);
      
      if (!person){
        return res.sendStatus(statusCodes.NotFound);
      }
      
      return res.status(statusCodes.OK).json(person);
    } catch (e) {
      return res.sendStatus(statusCodes.InternalServerError);
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      const people = await database('people');
      return res.status(statusCodes.OK).json(people);
    } catch (e) {
      return res.sendStatus(statusCodes.InternalServerError);
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
  api.post('/:personID/addresses', async (req, res) => {
    try {
      const [address] = await database('addresses')
        .insert({ person_id: req.params.personID, ...req.body })
        .returning('*');

        if (!address){
          return res.sendStatus(statusCodes.NotFound);
        }

      return res.status(statusCodes.OK).json(address);
    } catch (e) {
      return res.sendStatus(statusCodes.InternalServerError);
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    try {
      const address = await database('addresses')
        .where({ id: req.params.addressID, person_id: req.params.personID})
        .whereNull('deleted_at');

      if (!address.length){
        return res.sendStatus(statusCodes.NotFound);
      }

      return res.status(statusCodes.OK).json(address);
    } catch (e){
      return res.sendStatus(statusCodes.InternalServerError);
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    try {
      const addresses = await database('addresses')
        .where({ person_id: req.params.personID })
        .whereNull('deleted_at');

      if (!addresses.length){
        return res.sendStatus(statusCodes.NotFound);
      }

      return res.status(statusCodes.OK).json(addresses);
    } catch (e) {
      return res.sendStatus(statusCodes.InternalServerError);
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
      const [deletedRecord] = await database('addresses')
        .where({ id: req.params.addressID, person_id: req.params.personID })
        .update({ deleted_at: moment().toISOString() })
        .returning(['id', 'deleted_at'])
        
        if (!deletedRecord){
          return res.sendStatus(statusCodes.NotFound);
        }

      return res.status(statusCodes.OK).json(deletedRecord);
    } catch (e) {
      return res.sendStatus(statusCodes.InternalServerError);
    }
  });
}
