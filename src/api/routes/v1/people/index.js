const statusCodes = require("../../../lib/httpStatusCodes");
const httpErrorMessages = require("../../../lib/httpErrorMessages");
const { database } = require("../../../lib/database");

module.exports = (api) => {
  // api.use

  /**
   * POST /v1/people
   * Create a new person
   */
  api.post("/", async (req, res, next) => {
    // console.log(req["body"]);
    try {
      let arr = await database("people").insert(req["body"]).returning("*");
      res.status(statusCodes.OK).json(arr[0]);
    } catch (e) {
      next(e);
      // res.sendStatus(statusCodes.InternalServerError);
    }
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get("/:personID", async (req, res) => {
    // console.log("👍", req.params.personID);
    let arr = await database("people").where({ id: req.params.personID });
    if (arr.length) {
      res.status(statusCodes.OK).json(arr[0]);
    } else {
      res.sendStatus(statusCodes.NotFound);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get("/", async (req, res) => {
    let arr = await database("people").select("*");
    res.status(statusCodes.OK).json(arr);
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
    let obj = { ...req["body"], person_id: req.params.personID };

    try {
      let arr = await database("addresses").insert(obj).returning("*");
      res.status(statusCodes.OK).json(arr[0]);
    } catch (e) {
      res.sendStatus(statusCodes.InternalServerError);
    }
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get("/:personID/addresses/:addressID", async (req, res) => {
    let arr = await database("addresses").where({
      id: req.params.addressID,
      person_id: req.params.personID,
    });
    if (arr.length) {
      res.status(statusCodes.OK).json(arr[0]);
    } else {
      res.sendStatus(statusCodes.NotFound);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get("/:personID/addresses", async (req, res) => {
    let arr = await database("addresses").where({
      person_id: req.params.personID,
    });
    res.status(statusCodes.OK).json(arr);
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
