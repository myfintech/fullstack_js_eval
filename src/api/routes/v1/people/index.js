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
      const newUser = await database('people')
        .returning("*")
        .insert(req.body);

      res
        .status(statusCodes.OK)
        .json(newUser[0])

    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res, next) => {
    try {
      const foundUser = await database('people').where({ id: req.params.personID }).first();

      if (foundUser) {
        res
          .status(statusCodes.OK)
          .json(foundUser)
      } else {
        res
          .sendStatus(statusCodes.NotFound);
      }

    } catch (error) {
      next(error);
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res, next) => {
    try {
      const allUsers = await database.select("*").from('people');

      res
        .status(statusCodes.OK)
        .json(allUsers)

    } catch (error) {
      next(error);
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
  api.post('/:personID/addresses', async (req, res, next) => {
    try {
      const newAddress = await database('addresses').returning("*").insert({ ...req.body, person_id: req.params.personID });

      res
        .status(statusCodes.OK)
        .json(newAddress[0])

    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      const foundAddress = await database('addresses').where({
        id: req.params.addressID,
        person_id: req.params.personID,
        deleted_at: null
      }).first();

      if (foundAddress) {
        res
          .status(statusCodes.OK)
          .json(foundAddress)
      } else {
        res
          .sendStatus(statusCodes.NotFound)
      }

    } catch (error) {
      next(error);
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res, next) => {
    try {
      const allAddresses = await database('addresses').where({
        person_id: req.params.personID,
        deleted_at: null
      });

      res
        .status(statusCodes.OK)
        .json(allAddresses)

    } catch (error) {
      next(error);
    }

  })

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      let deletedAddress = await database('addresses')
        .where({
          id: req.params.addressID,
          person_id: req.params.personID,
          deleted_at: null
        })
        .returning("*")
        .update({
          deleted_at: moment().toISOString()
        });

      res
        .status(statusCodes.OK)
        .json(deletedAddress[0])

    } catch (error) {
      next(error);
    }
  })
}
