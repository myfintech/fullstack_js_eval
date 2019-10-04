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
      let newPerson = req.body;
      if (!newPerson) {
        res.sendStatus(404);
      } else {
        let [person] = await database('people')
          .returning([
            'id',
            'first_name',
            'last_name',
            'title',
            'company',
            'birthday',
            'created_at'
          ])
          .insert([newPerson]);
        res.status(200).json(person);
      }
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res, next) => {
    try {
      let personID = req.params.personID;

      if (!personID) {
        res.sendStatus(404);
      } else {
        let [person] = await database('people')
          .returning([
            'id',
            'first_name',
            'last_name',
            'title',
            'company',
            'birthday',
            'created_at'
          ])
          .where('id', personID);
        if (person) {
          delete person.updated_at;
          delete person.deleted_at;
          res.status(200).json(person);
        } else {
          res.sendStatus(404);
        }
      }
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res, next) => {
    try {
      let people = await database('people').select('*');
      res.status(200).json([people]);
    } catch (err) {
      next(err);
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
      let personID = req.params.personID;
      if (!personID) {
        res.sendStatus(404);
      } else {
        let [person] = await database('people')
          .returning([
            'id',
            'first_name',
            'last_name',
            'title',
            'company',
            'birthday',
            'created_at'
          ])
          .where('id', personID);

        let address = await database('addresses')
          .insert()
          .where(person);
        res.status(200).json(address);
      }
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res, next) => {
    try {
      let personID = req.params.personID;
      let addressID = req.params.addressID;

      if (!personID) {
        res.sendStatus(404);
      } else {
        let address = await database('people').join(
          'addresses',
          personID,
          addressID
        );
        if (!address) {
          res.sendStatus(404);
        } else {
          res.status(200).json(address);
        }
      }
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    let personID = req.params.personID;

    if (!personID) {
      res.sendStatus(404);
    } else {
      let address = await database('people').join(
        'addresses',
        personID,
        'person_id'
      );
      if (!address) {
        res.sendStatus(404);
      } else {
        res.status(200).json([address]);
      }
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
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented);
  });
};
