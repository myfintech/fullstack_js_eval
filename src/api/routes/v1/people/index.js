const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const { database } = require('../../../lib/database')

module.exports = (api) => {
  /**
   * POST /v1/people
   * Create a new person
   */
  api.post('/', async (req, res, next) => {
    try{
      const personReq = req.body;
      const id = Math.round(Math.random() * 100);
      req.body.id = id;
      console.log(personReq);
      //id not entering req.body had to force it
      const newPerson = await database('people').insert(personReq);
      res
      .status(200)
      .json(newPerson);
    } catch (err){
      next(err);
    }

  })

  /**
   * GET /v1/people/:personID
   * Retrieve a person by their ID
   */
  api.get('/:personID', async (req, res) => {
    console.log(req.params.personID);
    try{
      console.log(req.params.personID, 'id');
      //personID coming up undefined...
      const singlePerson = await database('people').where('id', req.params.personID).select();
      console.log(singlePerson);
      if(!singlePerson){
        res
        .status(404)
      } else {
        res
        .status(200)
        .json(singlePerson)
      }
      //another idea:
      // await database('people').query(
      //   'SELECT * FROM '+ req.params.personID,
      //   (error, rows)=>{
      //     if(!error){
      //       //when there is no error
      //       res.send(rows);
      //     }else{
      //       //when there is an error
      //       res.send(error);
      //     }
      //   });
    } catch (err){
      console.log(err);
    }

  })

  /**
   * GET /v1/people
   * Retrieve a list of people
   */
  api.get('/', async (req, res) => {
    try{
    const body = req.body;
    console.log(body, 'body');
    const get = await database('people').select(body);

    res
      .status(200)
      .json(get)
    } catch (err){
      console.log(err);
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
    try{
      const personReq = req.body;
      const id = Math.round(Math.random() * 100);
      req.body.id = id;
      console.log(personReq);
      //id not entering req.body had to force it
      const newPerson = await database('people').select().where({
        id: req.params.personID,
      }).contains('addresses').insert(personReq);
      res
      .status(200)
      .json(newPerson);
    } catch (err){
      console.log(err);
    }
  })

  /**
   * GET /v1/people/:personID/addresses/:addressID
   * Retrieve an address by it's addressID and personID
   **/
  api.get('/:personID/addresses/:addressID', async (req, res) => {
    console.log(req.params.personID.addresses.addressID);
    try{
      console.log(req.params.personID, 'id');
      //personID coming up undefined...
      const singlePersonAtAddress = await database('people').where('id', req.params.addresses.addressID).select();
      console.log(singlePersonAtAddress);
      if(!singlePersonAtAddress){
        res
        .status(404)
      } else {
        res
        .status(200)
        .json(singlePersonAtAddress)
      }
    }
    catch (err){
      console.log(err);
    }
  })

  /**
   * GET /v1/people/:personID/addresses
   * List all addresses belonging to a personID
   **/
  api.get('/:personID/addresses', async (req, res) => {
    try{
      const body = req.body;
      console.log(body, 'body');
      const getAll = await database('people').findById(req.params.personID).contains(addresses).select(body);

      res
        .status(200)
        .json(getAll)
      } catch (err){
        console.log(err);
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
    try{
      const deletePerson = await database('people').findByIdAndRemove({id:req.params.personID.addresses.addressID})

      res
        .status(200)
        .json(deletePerson);

    }catch(err){
      console.log(err);
    }
  })}
