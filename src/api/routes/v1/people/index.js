const statusCodes = require("../../../lib/httpStatusCodes");
const httpErrorMessages = require("../../../lib/httpErrorMessages");
const { database } = require("../../../lib/database");
const moment = require("moment");

module.exports = api => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post("/", async (req, res, next) => {
    try {
      var person = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birthday: req.body.birthday,
        company: req.body.company,
        title: req.body.title
      };

      const addPerson = database("people")
        .insert(person)
        .returning("id")
        .then(([id]) => {
          person.id = id;
          res.status(statusCodes.OK).json(person);
        });
    } catch (err) {
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
      const person = database("people")
        .select("first_name", "last_name", "birthday", "company", "title", "id")
        .where({ id: req.params.personID })
        .then(([person]) => {
          if (!person) {
            res.status(statusCodes.NotFound).send("Not found");
          } else {
            person.birthday = person.birthday.toISOString().slice(0, 10);
            res.status(statusCodes.OK).send(person);
          }
        });
    } catch (err) {
      res.status(err).json(httpErrorMessages.NotImplemented);
    }
  });

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get("/", async (req, res) => {
    try {
      const getPeople = database("people")
        .select()
        .then(getPeople => {
          res.status(statusCodes.OK).send(getPeople);
        });
    } catch (err) {
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
    // console.log("*** url: " + req.originalUrl);
    try {
      var address = {
        person_id: req.params.personID,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
      };
      // Check for foreign key validity, if key - person id is found in 'people' table, insert new address row
      const checkFk = database("people")
        .select("id")
        .where({ id: req.params.personID, deleted_at: null })
        .then(([checkFk]) => {
          if (!checkFk.id) {
            res.status(statusCodes.NotFound).send("Person not found");
          } else {
            const addAddress = database("addresses")
              .insert(address)
              .returning("id")
              .then(([id]) => {
                address.id = id;
                res.status(statusCodes.OK).json(address);
              });
          }
        });
    } catch (err) {
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
      // console.log("*** url: " + req.originalUrl);
      const address = database("addresses")
        .select("person_id", "line1", "line2", "city", "state", "zip", "id")
        .where({
          id: req.params.addressID,
          person_id: req.params.personID,
          deleted_at: null
        })
        .then(([address]) => {
          if (!address) {
            res.status(statusCodes.NotFound).send("Not found");
          } else {
            res.status(statusCodes.OK).json(address);
          }
        });
    } catch (err) {
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
      // console.log("*** url: " + req.originalUrl);
      const getAdresses = database("addresses")
        .select()
        .where({ person_id: req.params.personID, deleted_at: null })
        .then(getAdresses => {
          if (!getAdresses) {
            res.status(statusCodes.NotFound).send("Not found");
          } else {
            res.status(statusCodes.OK).send(getAdresses);
          }
        });
    } catch (err) {
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
    // console.log("*** url: " + req.originalUrl);
    try {
      let delDate = moment().toISOString();
      const [addrress] = await database("addresses")
        .update({ deleted_at: delDate }, ["deleted_at"])
        .where({
          id: req.params.addressID,
          person_id: req.params.personID
        });
      res.status(statusCodes.OK).send(addrress);
    } catch (error) {
      res
        .status(statusCodes.NotImplemented)
        .json(httpErrorMessages.NotImplemented);
    }
  });
};
