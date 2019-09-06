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
    const person = req.body;
    if (Object.entries(person).length === 0 && person.constructor === Object) {
      const err = new Error('empty request body')
      err.httpStatusCode = 400
      return next(err)
    }

    database.insert(person).returning('id').into('people').then(function(id) {
      person['id'] = id[0];
      res
        .status(200)
        .json(person)
    }).catch((err) => {
      err.httpStatusCode = 404
      return next(err)
    })
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res, next) => {
    const person_id = req.params.personID;
    if (!person_id) {
      const err = new Error('personID is required')
      err.httpStatusCode = 400
      return next(err)
    }

    database('people')
      .select("*")
      .where({
        id: person_id
      })
      .then(rows => {
        if (rows.length === 0) {
          const err = new Error('personID not found')
          err.httpStatusCode = 404
          return next(err)
        }
        deleteNullRows(rows[0]);
        rows[0].birthday = new moment(rows[0].birthday).format('YYYY-MM-DD'); //Knex.js enters POSTGRESQL DATE data types  as dates with timezone by default so using this line to remove the timezone from the date string
        res
          .status(200)
          .json(rows[0])
      }).catch((err) => {
        err.httpStatusCode = 404
        return next(err)
      })
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res, next) => {
    database('people')
      .select("*")
      .then(rows => {
        res
          .status(200)
          .json(rows)
      }).catch((err) => {
        err.httpStatusCode = 404
        return next(err)
      })
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
  api.post('/:personID/addresses', async (req, res, next) => {
    const person_id = req.params.personID;
    const address = req.body;
    if (Object.entries(address).length === 0 && address.constructor === Object) {
      return res.status(400).send({
        message: 'empty request body'
      });
    } else if (!person_id) {
      return res.status(400).send({
        message: 'personID is required'
      });
    }

    address.person_id = person_id;
    database.insert(address).returning('id').into('addresses').then(function(id) {
      address['id'] = id[0];
      res
        .status(200)
        .json(address)
    }).catch((err) => {
      err.httpStatusCode = 404
      return next(err)
    })
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res, next) => {
    const person_id = req.params.personID;
    const address_id = req.params.addressID;
    if (!person_id || !address_id) {
      const err = new Error('personID and addressID are required')
      err.httpStatusCode = 400
      return next(err)
    }

    database('addresses')
      .select("*")
      .whereNull('deleted_at')
      .where({
        id: address_id,
        person_id: person_id
      })
      .then(rows => {
        if (rows.length === 0) {
          const err = new Error('personID and addressID not found')
          err.httpStatusCode = 404
          return next(err)
        }
        deleteNullRows(rows[0]);
        res
          .status(200)
          .json(rows[0])
      }).catch((err) => {
        err.httpStatusCode = 404
        return next(err)
      })
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res, next) => {
    const person_id = req.params.personID;
    if (!person_id) {
      const err = new Error('personID is required')
      err.httpStatusCode = 400
      return next(err)
    }

    database('addresses')
      .select("*")
      .whereNull('deleted_at')
      .where({
        person_id: person_id
      })
      .then(rows => {
        if (rows.length === 0) {
          const err = new Error('personID not found')
          err.httpStatusCode = 404
          return next(err)
        }
        res
          .status(200)
          .json(rows)
      }).catch((err) => {
        err.httpStatusCode = 404
        return next(err)
      })
  })

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res, next) => {
    const person_id = req.params.personID;
    const address_id = req.params.addressID;
    if (!person_id || !address_id) {
      const err = new Error('personID and addressID are required')
      err.httpStatusCode = 400
      return next(err)
    }

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
        if (updatedRows.length === 0) {
          const err = new Error('personID and addressID not found')
          err.httpStatusCode = 404
          return next(err)
        }
        res
          .status(200)
          .json(updatedRows[0])
      }).catch((err) => {
        err.httpStatusCode = 404
        return next(err)
      })
  })

}
