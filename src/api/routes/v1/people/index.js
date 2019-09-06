const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const {
  database
} = require('../../../lib/database')
const moment = require('moment')


module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      database.insert(req.body).returning('id').into('people').then(function(id) {
        let person = req.body;
        person['id'] = id[0];
        res
          .status(200)
          .json(person)
      });
    } catch (e) {
      console.log(e)
    }
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      let id = req.params.personID;
      database('people')
        .select("*")
        .where({
          id: id
        })
        .then(rows => {
          deleteNullRows(rows[0]);
          rows[0].birthday = new moment(rows[0].birthday).format('YYYY-MM-DD'); //Knex.js enters POSTGRESQL DATE data types  as dates with timezone by default so using this line to remove the timezone from the date string
          res
            .status(200)
            .json(rows[0])
        }).catch((err) => {
          res
            .sendStatus(404)
        })
    } catch (e) {
      console.log(e)
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      database('people')
        .select("*")
        .then(rows => {
          res
            .status(200)
            .json(rows)
        })
    } catch (e) {
      console.log(e)
    }
  })

  function deleteNullRows(person) {
    for (var i in person) {
      if (person[i] === null) {
        delete person[i];
      } else if (person instanceof Array && typeof person[i] === 'object') {
        deleteNullRows(person[i]);
      }
    }
  }

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
    let person_id = req.params.personID;
    let body = req.body;
    body.person_id = person_id;
    database.insert(body).returning('id').into('addresses').then(function(id) {
      let address = req.body;
      address['id'] = id[0];
      res
        .status(200)
        .json(address)
    });

  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    try {
      let person_id = req.params.personID;
      let address_id = req.params.addressID;
      database('addresses')
        .select("*")
        .whereNull('deleted_at')
        .where({
          id: address_id,
          person_id: person_id
        })
        .then(rows => {
          deleteNullRows(rows[0]);
          res
            .status(200)
            .json(rows[0])
        }).catch((err) => {
          res
            .sendStatus(404)
        })
    } catch (e) {
      console.log(e)
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    try {
      let person_id = req.params.personID;
      database('addresses')
        .select("*")
        .whereNull('deleted_at')
        .where({
          person_id: person_id
        })
        .then(rows => {
          deleteNullRows(rows);
          res
            .status(200)
            .json(rows)
        }).catch((err) => {
          res
            .sendStatus(404)
        })
    } catch (e) {
      console.log(e)
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
      let person_id = req.params.personID;
      let address_id = req.params.addressID;
      database('addresses')
        .select("*")
        .whereNull('deleted_at')
        .where({
          id: address_id,
          person_id: person_id
        }).update({
          deleted_at: moment().toISOString()
        })
        .returning('*')
        .then(updatedRows => {
          res
            .status(200)
            .json(updatedRows[0])
        }).catch((err) => {
          res
            .sendStatus(404)
        })
    } catch (e) {
      console.log(e)
    }
  })
}
