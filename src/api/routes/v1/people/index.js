const moment = require("moment");
const statusCodes = require("../../../lib/httpStatusCodes");
const httpErrorMessages = require("../../../lib/httpErrorMessages");
const { database } = require("../../../lib/database");

module.exports = api => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post("/", async (req, res, next) => {
    try {
      const insertResultArray = await database("people")
        .returning(["*"])
        .insert({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          birthday: req.body.birthday,
          company: req.body.company,
          title: req.body.title
        });

      const person = insertResultArray[0];

      return res.status(statusCodes.OK).json(person);
    } catch (error) {
      return res
        .status(statusCodes.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  });

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get("/:personID", async (req, res) => {
    try {
      if (!req.params.personID) {
        return res
          .status(statusCodes.BadRequest)
          .json({ message: "Missing personID" });
      }

      const selectResultArray = await database("people")
        .select()
        .where({
          id: req.params.personID
        });

      if (selectResultArray.length === 0) {
        return res
          .status(statusCodes.NotFound)
          .json({ message: "Person not found." });
      }

      const person = selectResultArray[0];

      return res.status(statusCodes.OK).json(person);
    } catch (error) {
      return res
        .status(statusCodes.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get("/", async (req, res) => {
    try {
      const peopleArray = await database("people").whereNull("deleted_at");

      return res.status(statusCodes.OK).json(peopleArray);
    } catch (error) {
      return res
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
      const insertResultArray = await database("addresses")
        .returning(["*"])
        .insert({
          person_id: req.params.personID,
          line1: req.body.line1,
          line2: req.body.birthline2day,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip
        });

      const address = insertResultArray[0];

      return res.status(statusCodes.OK).json(address);
    } catch (error) {
      return res
        .status(statusCodes.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  });

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get("/:personID/addresses/:addressID", async (req, res) => {
    try {
      if (!req.params.personID) {
        return res
          .status(statusCodes.BadRequest)
          .json({ message: "Missing personID" });
      }

      if (!req.params.addressID) {
        return res
          .status(statusCodes.BadRequest)
          .json({ message: "Missing addressID" });
      }

      const selectResultArray = await database("addresses")
        .select()
        .where({
          id: req.params.addressID,
          person_id: req.params.personID
        });

      if (selectResultArray.length === 0) {
        return res
          .status(statusCodes.NotFound)
          .json({ message: "Address not found." });
      }

      const address = selectResultArray[0];

      return res.status(statusCodes.OK).json(address);
    } catch (error) {
      return res
        .status(statusCodes.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  });

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get("/:personID/addresses", async (req, res) => {
    try {
      if (!req.params.personID) {
        return res
          .status(statusCodes.BadRequest)
          .json({ message: "Missing personID" });
      }

      const addressArray = await database("addresses")
        .select()
        .whereNull("deleted_at")
        .where({
          person_id: req.params.personID
        });

      return res.status(statusCodes.OK).json(addressArray);
    } catch (error) {
      return res
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
      if (!req.params.personID) {
        return res
          .status(statusCodes.BadRequest)
          .json({ message: "Missing personID" });
      }

      if (!req.params.addressID) {
        return res
          .status(statusCodes.BadRequest)
          .json({ message: "Missing addressID" });
      }

      const selectResultArray = await database("addresses")
        .select()
        .where({
          id: req.params.addressID,
          person_id: req.params.personID
        });

      if (selectResultArray.length === 0) {
        return res
          .status(statusCodes.NotFound)
          .json({ message: "Address not found." });
      }

      const address = selectResultArray[0];

      const updateResultBoolean = await database("addresses")
        .where({
          id: address.id,
          person_id: address.person_id
        })
        .update({
          deleted_at: moment().toISOString()
        });

      const deletedAddress = updateResultBoolean;

      return res.status(statusCodes.OK).json(deletedAddress);
    } catch (error) {
      return res
        .status(statusCodes.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  });
};
