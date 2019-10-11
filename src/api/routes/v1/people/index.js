const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')
const moment = require('moment')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', (req, res) => {
    database
      .returning(['id', 'first_name', 'last_name', 'birthday', 'company', 'title'])
      .insert({first_name: 'Juan', last_name: 'Schmidt', birthday: '01/01/1970', company: 'MegaCorp Inc', title: 'Rude Bwoy'})
      .into('people')
      .then(postPerson => {
        res
          .type('json')
          .status(statusCodes.OK)
          .json(postPerson[0])
      })
      .catch((err) => {
        console.error(err)
        res
          .status(statusCodes.InternalServerError)
          .end()
      })
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', (req, res) => {
    database
      .select('id', 'first_name', 'last_name', 'birthday', 'company', 'title')
      .from('people')
      .where('id', req.params.personID)
      .whereNull('deleted_at')
      .then(getPerson => {
        if(getPerson.length) {
          res
            .type('json')
            .status(statusCodes.OK)
            .json(getPerson[0])
        } else {
          res
            .status(statusCodes.NotFound)
            .end()
        }
      })
      .catch((err) => {
        console.error(err)
        res
          .status(statusCodes.InternalServerError)
          .end()
      })
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', (req, res) => {
    database
      .select('*')
      .from('people')
      .whereNull('deleted_at')
      .then(getPeople => {
        res
          .type('json')
          .status(statusCodes.OK)
          .send(getPeople)
      })
      .catch((err) => {
        console.error(err)
        res
          .status(statusCodes.InternalServerError)
          .end()
      })
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
  api.post('/:personID/addresses', (req, res) => {
    database
      .returning(['id', 'person_id', 'line1', 'line2', 'city', 'state', 'zip'])
      .insert({person_id: req.params.personID, line1: '45 Main St', line2: 'Ste 404', city: 'Kennebunkport', state: 'ME', zip: '04046'})
      .into('addresses')
      .then(postAddress => {
        res
          .type('json')
          .status(statusCodes.OK)
          .json(postAddress[0])
      })
      .catch((err) => {
        console.error(err)
        res
          .status(statusCodes.InternalServerError)
          .end()
      })
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', (req, res) => {
    database
      .select('id', 'person_id', 'line1', 'line2', 'city', 'state', 'zip')
      .from('addresses')
      .where({'id': req.params.addressID, 'person_id': req.params.personID })
      .whereNull('deleted_at')
      .then(getAddress => {
        if(getAddress.length) { 
          res
            .type('json')
            .status(statusCodes.OK)
            .json(getAddress[0])
        } else {
          res
            .status(statusCodes.NotFound)
            .end()
        }
      })
      .catch((err) => {
        console.error(err)
        res
          .status(statusCodes.InternalServerError)
          .end()
      })
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', (req, res) => {
    database
      .select('id', 'person_id', 'line1', 'line2', 'city', 'state', 'zip')
      .from('addresses')
      .where({'person_id': req.params.personID})
      .whereNull('deleted_at')
      .then(getAddresses => {
        res
          .type('json')
          .status(statusCodes.OK)
          .json(getAddresses)
      })
      .catch((err) => {
        console.error(err)
        res
          .status(statusCodes.InternalServerError)
          .end()
      })
  })

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', (req, res) => {
    database('addresses')
      .returning(['id', 'deleted_at'])
      .where({'id': req.params.addressID, 'person_id': req.params.personID })
      .whereNull('deleted_at')
      .update({ deleted_at: moment().toISOString()})
      .then(delAddress => {
        if(delAddress.length) {
          res
            .type('json')
            .status(statusCodes.OK)
            .json(delAddress)
        } else {
          res
            .status(statusCodes.NotFound)
            .end()
        }
      })
      .catch((err) => {
        console.error(err)
        res
          .status(statusCodes.InternalServerError)
          .end()
      })
  })
}
