const statusCodes = require('../../../lib/httpStatusCodes');
const httpErrorMessages = require('../../../lib/httpErrorMessages');
const { database } = require('../../../lib/database');
const moment = require("moment");

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {

    const newPerson = ({

      first_name: req.body.first_name,
      last_name: req.body.last_name,
      title: req.body.title,
      company: req.body.company,
      birthday: req.body.birthday,
      created_at: req.body.created_at,
      updated_at: req.body.updated_at,
      deleted_at: req.body.deleted_at

    });

    let result;

    try {

      [result] = await database
        .from("people")
        .insert(newPerson, ['id']);

    } catch (err) {

      console.log(err);
      return;
    }

    newPerson.id = result.id;

    res
      .contentType("json")
      .status(statusCodes.OK)
      .json(newPerson);
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {

    const personId = req.params.personID;

    let result;

    try {

      [result] = await database
        .select("id", "first_name", "last_name", "title", "company", "birthday", "created_at")
        .from("people")
        .where({ id: personId })
        .whereNull("deleted_at");

    } catch (err) {

      console.log(err);
      return;

    }

    if (result) {

      result.birthday = moment(result.birthday).format("YYYY-MM-DD");

      res
        .contentType("json")
        .status(statusCodes.OK)
        .json(result);

    } else {

      res
        .status(statusCodes.NotFound)
        .json();

    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {

    let result;

    try {

      result = await database
        .select()
        .from("people")
        .whereNull("deleted_at");

    } catch (err) {

      console.log(err);
      return;

    }

    res
      .contentType("json")
      .status(statusCodes.OK)
      .json(result);
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

    const newAddress = ({

      person_id: req.body.person_id,
      line1: req.body.line1,
      line2: req.body.line2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      created_at: req.body.created_at,
      updated_at: req.body.updated_at,
      deleted_at: req.body.deleted_at

    });

    let result;

    try {

      [result] = await database
        .from("addresses")
        .insert(newAddress, ['id']);

    } catch (err) {

      console.log(err);
      return;

    }

    newAddress.id = result.id;

    res
      .contentType("json")
      .status(statusCodes.OK)
      .json(newAddress);

  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {

    const personId = req.params.personID;
    const addressId = req.params.addressID;
    let result;

    try {

      [result] = await database
        .select("id", "person_id", "line1", "city", "state", "zip", "created_at")
        .from("addresses")
        .where({ person_id: personId, id: addressId })
        .whereNull("deleted_at");

    } catch (err) {

      console.log(err);
      return;

    }

    if (result) {

      res
        .contentType("json")
        .status(statusCodes.OK)
        .json(result);

    } else {

      res
        .status(statusCodes.NotFound)
        .json();

    }

  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {

    let result;

    try {

      result = await database
        .select()
        .from("addresses")
        .whereNull("deleted_at");

    } catch (err) {

      console.log(err);
      return;

    }

    res
      .contentType("json")
      .status(statusCodes.OK)
      .json(result);

  });

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete('/:personID/addresses/:addressID', async (req, res) => {

    const personId = req.params.personID;
    const addressId = req.params.addressID;
    const deletedTime = moment().toISOString();
    let result;

    try {

      result = await database
        .select("deleted_at")
        .from("people")
        .where({ id: personId })
        .update({ deleted_at: deletedTime });

    } catch (err) {

      console.log(err);
      return;

    }

    try {

      result = await database
        .select("deleted_at")
        .from("addresses")
        .where({ id: addressId })
        .update({ deleted_at: deletedTime });

    } catch (err) {

      console.log(err);
      return;

    }

    res
      .status(statusCodes.OK)
      .json();

  });
};
