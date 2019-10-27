const moment = require("moment");

const {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} = require("../../../lib/httpStatusCodes");
const {
  InternalServerErrorMsg,
  BadRequestMsg,
  NotFoundMsg,
} = require("../../../lib/httpErrorMessages");
const { database, dbConstants } = require("../../../lib/database");

const { ADDRESSES_TABLE, PEOPLE_TABLE } = dbConstants;

module.exports = api => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post("/", async (req, res) => {
    try {
      const result = await database(PEOPLE_TABLE)
        .insert(req.body)
        .returning("*");

      if (result && result[0]) {
        return res.status(OK).json(result[0]);
      }

      return res.status(InternalServerError).json(InternalServerErrorMsg);
    } catch (err) {
      console.log("POST /v1/people Error:", err);
      return res.status(BadRequest).json(BadRequestMsg);
    }
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get("/:personID", async (req, res) => {
    try {
      const result = await database(PEOPLE_TABLE)
        .select("*")
        .where({ id: req.params.personID })
        .first();

      if (result) {
        return res.status(OK).json(result);
      }

      return res.status(NotFound).json(NotFoundMsg);
    } catch (err) {
      console.log("GET /v1/people/:personID Error:", err);
      return res.status(BadRequest).json(BadRequestMsg);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get("/", async (req, res) => {
    try {
      const result = await database(PEOPLE_TABLE);
      return res.status(OK).json(result);
    } catch (err) {
      console.log("GET /v1/people Error:", err);
      return res.status(InternalServerError).json(InternalServerErrorMsg);
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
      const { body, params } = req;
      const result = await database(ADDRESSES_TABLE)
        .insert({
          person_id: params.personID,
          ...body,
        })
        .returning("*");

      if (result && result[0]) {
        return res.status(OK).json(result[0]);
      }

      return res.status(InternalServerError).json(InternalServerErrorMsg);
    } catch (err) {
      console.log("POST /v1/people/:personID/addresses Error:", err);
      return res.status(BadRequest).json(BadRequestMsg);
    }
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get("/:personID/addresses/:addressID", async (req, res) => {
    try {
      const { params } = req;
      const result = await database(ADDRESSES_TABLE)
        .select("*")
        .where({
          id: params.addressID,
          person_id: params.personID,
          deleted_at: null,
        })
        .first();

      if (result) {
        return res.status(OK).json(result);
      }

      return res.status(NotFound).json(NotFoundMsg);
    } catch (err) {
      console.log("GET /v1/people/:personID/addresses/addressID Error:", err);
      return res.status(BadRequest).json(BadRequestMsg);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get("/:personID/addresses", async (req, res) => {
    try {
      const { params } = req;
      const result = await database(ADDRESSES_TABLE)
        .select("*")
        .where({
          person_id: params.personID,
          deleted_at: null,
        });

      return res.status(OK).json(result);
    } catch (err) {
      console.log("GET /v1/people/:personID/addresses Error:", err);
      return res.status(BadRequest).json(BadRequestMsg);
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
      const { params } = req;
      const result = await database(ADDRESSES_TABLE)
        .where({
          id: params.addressID,
          person_id: params.personID,
        })
        .update({
          deleted_at: moment().toISOString(),
        })
        .returning(["id"]);

      return res.status(OK).json(result[0]);
    } catch (err) {
      console.log("DELETE /v1/people/:personID/addresses Error:", err);
      return res.status(BadRequest).json(BadRequestMsg);
    }
  });
};
