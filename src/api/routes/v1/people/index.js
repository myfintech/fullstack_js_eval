const statusCodes = require("../../../lib/httpStatusCodes");
const httpErrorMessages = require("../../../lib/httpErrorMessages");
const { database, knex } = require("../../../lib/database");

module.exports = api => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post("/", async (req, res, next) => {
    try {
      const [newPerson] = await database("people").insert(req.body, ["id"]);

      res.status(200).send(newPerson);
    } catch (error) {
      res
        .status(statusCodes.NotImplemented)
        .json(httpErrorMessages.NotImplemented);
    }
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get("/:personID", async (req, res) => {
    try {
      const [foundUser] = await database("people")
        .where({
          id: req.params.personID
        })
        .select("id");

      if (foundUser) {
        res.status(200).send(foundUser);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      res
        .status(statusCodes.NotImplemented)
        .json(httpErrorMessages.NotImplemented);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get("/", async (req, res) => {
    try {
      const allUsers = await database("people").select();

      if (allUsers.length > 0) {
        res.status(200).send(allUsers);
      } else {
        res.send("No Users yet :(");
      }
    } catch (error) {
      res
        .status(statusCodes.NotImplemented)
        .json(httpErrorMessages.NotImplemented);
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
      const [newAddress] = await database("addresses").insert(
        {
          person_id: req.params.personID,
          line1: req.body.line1,
          line2: req.body.line2,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          created_at: req.body.created_at
        },
        ["id"]
      );
      res.status(200).send(newAddress);
    } catch (error) {
      res
        .status(statusCodes.NotImplemented)
        .json(httpErrorMessages.NotImplemented);
    }
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get("/:personID/addresses/:addressID", async (req, res) => {
    try {
      const [foundAddress] = await database("addresses")
        .where({
          id: req.params.addressID,
          person_id: req.params.personID
        })
        .select("id");
      if (foundAddress) {
        res.status(200).send(foundAddress);
      } else {
        res.status(404).send("No address found :(");
      }
    } catch (error) {
      res
        .status(statusCodes.NotImplemented)
        .json(httpErrorMessages.NotImplemented);
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get("/:personID/addresses", async (req, res) => {
    try {
      const allAddresses = await database("addresses").select();

      if (allAddresses.length > 0) {
        res.status(200).send(allAddresses);
      } else {
        res.send("No addresses yet");
      }
    } catch (error) {
      res
        .status(statusCodes.NotImplemented)
        .json(httpErrorMessages.NotImplemented);
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
      const [updatedAddrress] = await database("addresses")
        .where({
          id: req.params.addressID,
          person_id: req.params.personID
        })
        .update({ deleted_at: database.fn.now() }, ["deleted_at"]);

      res.status(204).send(updatedAddrress);
    } catch (error) {
      res
        .status(statusCodes.NotImplemented)
        .json(httpErrorMessages.NotImplemented);
    }
  });
};
