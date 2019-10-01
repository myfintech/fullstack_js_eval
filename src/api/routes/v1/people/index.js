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
    try {
      await database('people')
        .insert(req.body, 'id')
        .then(person => {
          res.status(200).json({ id: person[0] });
        });
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
      await database('people')
        .where('id', req.params.personID)
        .select()
        .then(people => {
          if (people.length) {
            res.status(200).json({ id: people[0].id });
          } else {
            res
              .status(404)
              .json({
                error: `Could not find person with id ${req.params.personID}`
              });
          }
        });
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      await database('people')
        .select()
        .then(people => {
          res.status(200).json(people);
        });
    } catch (error) {
      console.error(error);
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
      req.body.person_id = req.params.personID;
      await database('addresses')
        .insert(req.body, 'id')
        .then(address => {
          res.status(200).json({ id: address[0] });
        });
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    console.log('params', req.params);
    try {
      await database('addresses')
        .where({ person_id: req.params.personID, id: req.params.addressID })
        .select()
        .then(address => {
          if (address.length){
          res.status(200).json({ id: address[0].id })
        } else {
          res
              .status(404)
              .json({
                error: `Could not find person with id ${req.params.personID} and address id ${req.params.addressID}`
              });
        }
        });
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    try {
      await database('addresses')
        .where('person_id', req.params.personID)
        .then(address => {
          res.status(200).json(address);
        });
    } catch (error) {
      console.error(error);
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
      await database('addresses')
        .where({ person_id: req.params.personID, id: req.params.addressID })
        .then(function(rows) {
          rows[0].deleted_at = moment().toISOString();
        })
        .then(address => {
          console.log('address', address);
          res.status(204).json();
        });
    } catch (error) {
      console.error(error);
    }
  });
}
