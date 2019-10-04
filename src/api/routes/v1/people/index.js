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
      let personID = Number(req.params.personID);

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
      let personID = Number(req.params.personID);
      if (!personID) {
        res.sendStatus(404);
      } else {
        const [address] = await database('addresses').insert(
          {
            person_id: personID,
            line1: req.body.line1,
            line2: req.body.line2,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            created_at: req.body.created_at
          },
          ['id']
        );
        res.status(200).send(address);
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
      let personID = Number(req.params.personID);
      let addressID = Number(req.params.addressID);

      const [address] = await database('addresses')
        .where({
          id: addressID,
          person_id: personID
        })
        .select('id');

      if (!address) {
        res.sendStatus(404);
      } else {
        res.status(200).send(address);
      }
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res, next) => {
    try {
      const addresses = await database('addresses').select();

      if (!addresses) {
        res.sendStatus(404);
      } else {
        res.status(200).send(addresses);
      }
    } catch (err) {
      next(err);
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
      let personID = Number(req.params.personID);
      let addressID = Number(req.params.addressID);

      await database('addresses')
        .where({
          id: addressID,
          person_id: personID
        })
        .update({ deleted_at: database.fn.now() }, ['deleted_at']);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
};
