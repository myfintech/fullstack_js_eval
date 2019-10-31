const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { people: personModel, addresses: addressModel } = require('../../../lib/models')

module.exports = (api) => {

  const handleGenericServerErrorResponse = (res) => res
    .status(statusCodes.InternalServerError)
    .json(httpErrorMessages.GenericInternalServerError)

  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try {
      const [newPerson] = await personModel.create(req.body)
      res.json(newPerson)
    } catch (err) {
      console.error(err)
      handleGenericServerErrorResponse(res)
    }
  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    try {
      const {personID: id} = req.params;
      const person = await personModel.findById(id)
      if (!person) {
        res
          .status(statusCodes.NotFound)
          .json({error: `Person with id (${id}) not found.`})
      } else {
        res.json(person);
      }
    } catch (err) {
      console.error(err)
      res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.GenericInternalServerError)
    }
  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try {
      const people = await personModel.list()
      res.json(people);
    } catch (err) {
      console.error(err)
      handleGenericServerErrorResponse(res)
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
      const {personID: id} = req.params;
      const person = await personModel.findById(id)
      if (!person) {
        res
          .status(statusCodes.NotFound)
          .json({error: `Could not add address to person. Person with id (${id}) not found.`})
      } else {
        const payload = {
          person_id: person.id,
          ...req.body
        }
        const [newAddress] = await addressModel.create(payload)
        res.json(newAddress)
      }
    } catch (err) {
      console.error(err)
      handleGenericServerErrorResponse(res)
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID

   -- comments:
   -- we could/should just use the primary key for fetching the address as it's unique
   -- however, perhaps we need to fetch person with the id and do any validation, etc first
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    try {
      const {personID: person_id, addressID: id} = req.params;
      const [address] = await addressModel.findByCriteria({id, person_id})
      if (!address) {
        res
          .status(statusCodes.NotFound)
          .json({error: `Address with id (${id}) and personID ${person_id} not found.`})
      } else {
        res.json(address);
      }
    } catch (err) {
      console.error(err)
      handleGenericServerErrorResponse(res)
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    try {
      const {personID: person_id} = req.params;
      const addressList = await addressModel.findByCriteria({person_id})
      res.json(addressList);
    } catch (err) {
      console.error(err)
      handleGenericServerErrorResponse(res)
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
    try {
      const { personID: person_id, addressID: id } = req.params;
      const [deletedAddress] = await addressModel.setDeleted({ id, person_id })
      res.json(deletedAddress);
    } catch (err) {
      console.error(err)
      handleGenericServerErrorResponse(res)
    }
  })
}
