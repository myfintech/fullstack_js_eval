const statusCodes = require("../../../lib/httpStatusCodes");
const httpErrorMessages = require("../../../lib/httpErrorMessages");
const { database, dbConstants } = require("../../../lib/database");

const { PEOPLE_TABLE } = dbConstants;

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
        return res.status(statusCodes.OK).json(result[0]);
      }

      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError);
    } catch (err) {
      console.log("POST /v1/people Error:", err);
      return res
        .status(statusCodes.BadRequest)
        .json(httpErrorMessages.BadRequest);
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
        return res.status(statusCodes.OK).json(result);
      }

      return res.status(statusCodes.NotFound).json(httpErrorMessages.NotFound);
    } catch (err) {
      console.log("GET /v1/people/:personID Error:", err);
      return res
        .status(statusCodes.BadRequest)
        .json(httpErrorMessages.BadRequest);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get("/", async (req, res) => {
    try {
      const result = await database(PEOPLE_TABLE);
      return res.status(statusCodes.OK).json(result);
    } catch (err) {
      console.log("GET /v1/people Error:", err);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError);
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
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented);
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get("/:personID/addresses/:addressID", async (req, res) => {
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented);
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get("/:personID/addresses", async (req, res) => {
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented);
  });

  /**
   * BONUS!!!!
   * DELETE /v1/people/:personID/addresses/:addressID
   * Mark an address as deleted by it's personID and addressID
   * Set it's deleted_at timestamp
   * Update the previous GET endpoints to omit rows where deleted_at is not null
   **/
  api.delete("/:personID/addresses/:addressID", async (req, res) => {
    res
      .status(statusCodes.NotImplemented)
      .json(httpErrorMessages.NotImplemented);
  });
};
