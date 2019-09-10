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
      const returnObject = ['id','first_name','last_name','birthday','company','title','created_at','updated_at','deleted_at'];
      const response = await database('people').returning(returnObject).insert({ 
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        title: req.body.title,
        company: req.body.company,
        birthday: req.body.birthday,
        created_at: req.body.created_at,
      });

      return res
        .status(statusCodes.OK)
        .json(response[0]); 

    } catch (error) {
      console.log('error',error);
      res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }

  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    const personID = req.params.personID;
    try {
      const response = await database.select().from('people').where({'id': personID});
      if (response.length > 0) {
        return res
          .status(statusCodes.OK)
          .json(response[0])
      } else {
        return res
          .status(statusCodes.NotFound)
          .json()
      }
    } catch (error) {
      console.log('error',error);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }
    
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      const response = await database.select().from('people');
      res
        .status(statusCodes.OK)
        .json(response)
    } catch (error) {
      console.log('error',error);
      res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)    
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
      const returnObject = ['id','person_id','line1','line2','city','state','zip','created_at','updated_at','deleted_at'];
      const response = await database('addresses').returning(returnObject).insert({ 
        person_id: req.params.personID,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        created_at: req.body.created_at,
      });

      return res
        .status(statusCodes.OK)
        .json(response[0]); 

    } catch (error) {
      console.log('error',error);
      res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    const personID = req.params.personID;
    const addressID = req.params.addressID;
    try {
      const response = await database.select().from('addresses').where({'person_id': personID, 'id': addressID});
      if (response.length > 0) {
        return res
          .status(statusCodes.OK)
          .json(response[0])
      } else {
        return res
          .status(statusCodes.NotFound)
          .json()
      }
    } catch (error) {
      console.log('error',error);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    const personID = req.params.personID;
    try {
      const response = await database.select().from('addresses').where({'person_id': personID});
      return res
        .status(statusCodes.OK)
        .json(response)
    } catch (error) {
      console.log('error',error);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
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
    const personID = req.params.personID;
    const addressID = req.params.addressID;
    try {
      const returnObject = ['id','person_id','line1','line2','city','state','zip','created_at','updated_at','deleted_at'];
      const response = await database('addresses').returning(returnObject).where({'person_id': personID, 'id': addressID}).update({'deleted_at': moment().toISOString()});
      return res
        .status(statusCodes.OK)
        .json(response[0])
    } catch (error) {
      console.log('error',error);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }
  })
}
