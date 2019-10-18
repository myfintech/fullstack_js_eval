const { database } = require("../../../lib/database");

// Model functions
const People = require("../../../lib/People")(database);
const Addresses = require("../../../lib/Addresses")(database);

const SendResponse = require("../../../lib/SendResponse");

module.exports = api => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post("/", async (req, res, next) => {
    try {
      const person = await People.create(req.body);
      return SendResponse.json(res, person);
    } catch (error) {
      return SendResponse.error(res, error);
    }
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get("/:personID", async (req, res) => {
    try {
      const person = await People.getById({
        personID: req.params.personID
      });
      return SendResponse.json(res, person);
    } catch (error) {
      return SendResponse.error(res, error);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get("/", async (req, res) => {
    try {
      const people = await People.getAll();
      return SendResponse.json(res, people);
    } catch (error) {
      return SendResponse.error(res, error);
    }
  });

  /**
   * DELETE /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.delete("/:personID", async (req, res) => {
    try {
      const person = await People.remove({
        personID: req.params.personID
      });
      return SendResponse.json(res, person);
    } catch (error) {
      return SendResponse.error(res, error);
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
  api.post("/:personID/addresses", async (req, res) => {
    try {
      const address = await Addresses.create({
        ...req.body,
        personID: req.params.personID
      });
      return SendResponse.json(res, address);
    } catch (error) {
      return SendResponse.error(res, error);
    }
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get("/:personID/addresses/:addressID", async (req, res) => {
    try {
      const address = await Addresses.getByIdAndPersonId({
        addressID: req.params.addressID,
        personID: req.params.personID
      });

      return SendResponse.json(res, address);
    } catch (error) {
      return SendResponse.error(res, error);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get("/:personID/addresses", async (req, res) => {
    try {
      const addresses = await Addresses.getAll({
        personID: req.params.personID
      });

      return SendResponse.json(res, addresses);
    } catch (error) {
      return SendResponse.error(res, error);
    }
  });

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete("/:personID/addresses/:addressID", async (req, res) => {
    try {
      const isDeleted = await Addresses.remove({
        addressID: req.params.addressID,
        personID: req.params.personID
      });
      return SendResponse.json(res, isDeleted);
    } catch (error) {
      return SendResponse.error(res, error);
    }
  });
};
