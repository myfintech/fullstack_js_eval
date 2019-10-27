const fixtures = require("./fixtures");
const httpStatusCodes = require("../lib/httpStatusCodes");
const { client } = require("./setup/supertestServer");
const { expect } = require("chai");

const peopleRoute = `/v1/people`;
const personRoute = personId =>
  `/v1/people/${personId || fixtures.firstPerson.id}`;
const addressesRoute = () => `/v1/people/${fixtures.firstPerson.id}/addresses`;
const addressRoute = (personId, addressId) =>
  `/v1/people/${personId || fixtures.firstPerson.id}/addresses/${addressId ||
    fixtures.firstAddress.id}`;

describe("People API", () => {
  it("POST /v1/people should create a new person", async () => {
    await client
      .post(peopleRoute)
      .send(fixtures.firstPerson)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        fixtures.firstPerson = resp.body;
      });
  });

  it("GET /v1/people/:personID should return a 200 with an object of the person with that id", async () => {
    await client
      .get(personRoute())
      .expect(httpStatusCodes.OK, fixtures.firstPerson);
  });

  it("GET /v1/people/:personID should return a 404 when an incorrect id is used", async () => {
    await client.get(personRoute("99999999")).expect(httpStatusCodes.NotFound);
  });

  it("GET /v1/people should return a 200 with an array of people objects", async () => {
    await client
      .get(peopleRoute)
      .expect("Content-Type", fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        expect(resp.body).to.have.lengthOf.above(0);
      });
  });

  /**
   * Do not modify above this line (use them as a reference point)
   * Do not modify beyond this point until you have reached
   * TDD / BDD Mocha.js / Chai.js
   * ======================================================
   * ======================================================
   */

  it("POST /v1/people/:personID/addresses should create a new address", async () => {
    await client
      .post(addressesRoute())
      .send({
        person_id: fixtures.firstPerson.id,
        ...fixtures.firstAddress,
      })
      .expect(httpStatusCodes.OK)
      .then(resp => {
        fixtures.firstAddress = resp.body;
      });
  });

  it("GET /v1/people/:personID/addresses/:addressID should return an address by its id and its person_id", async () => {
    await client
      .get(addressRoute())
      .expect("Content-Type", fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK, fixtures.firstAddress);
  });

  it("GET /v1/people/:personID/addresses/:addressID should return a 404 when an incorrect personID is used", async () => {
    await client.get(addressRoute(99999999)).expect(httpStatusCodes.NotFound);
  });

  it("GET /v1/people/:personID/addresses should return a list of addresses belonging to the person by that id", async () => {
    await client
      .get(addressesRoute())
      .expect("Content-Type", fixtures.contentTypes.json)
      .expect(httpStatusCodes.OK)
      .then(resp => {
        expect(resp.body).to.have.lengthOf.above(0);
        expect(resp.body[0]).to.eql(fixtures.firstAddress);
      });
  });

  // BONUS!!!
  it("DELETE /v1/people/:personID/addresses/:addressID should delete an address by its id (BONUS)", async () => {
    await client
      .delete(addressRoute())
      .expect(httpStatusCodes.OK)
      .then(res => {
        expect(res.body).to.eql({ id: fixtures.firstAddress.id });
      });
  });

  it("GET /v1/people/:personID/addresses/ should not return a deleted address", async () => {
    await client
      .get(addressesRoute())
      .expect(httpStatusCodes.OK)
      .then(res => {
        expect(res.body).to.have.lengthOf(0);
      });
  });

  it("GET /v1/people/:personID/addresses/:addressID should not return a deleted address", async () => {
    await client.get(addressRoute()).expect(httpStatusCodes.NotFound);
  });
});
