const { database } = require('../../../lib/database')
const moment = require('moment')

const addPerson = async (req) => {
    const returnObject = ['id','first_name','last_name','birthday','company','title','created_at','updated_at','deleted_at'];
    const response = await database('people').returning(returnObject).insert({ 
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        title: req.body.title,
        company: req.body.company,
        birthday: req.body.birthday,
        created_at: req.body.created_at,
    });
  
    return response;
}

const getPerson = async (personID) => {
    const response = await database.select().from('people').where({'id': personID}).whereNull('deleted_at');
    return response;
}

const getPeople = async () => {
    const response = await database.select().from('people').whereNull('deleted_at');
    return response;
}

const addAddress = async (req) => {
    const returnObject = ['id','person_id','line1','line2','city','state','zip','created_at','updated_at','deleted_at'];
    const response = await database('addresses').returning(returnObject).insert({ 
        person_id: req.params.personID,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        created_at: req.body.created_at,
    });

    return response;
}

const getAddress = async (personID, addressID) => {
    const response = await database.select().from('addresses').where({'person_id': personID, 'id': addressID}).whereNull('deleted_at');
    return response;
}

const getAddresses = async (personID) => {
      const response = await database.select().from('addresses').where({'person_id': personID}).whereNull('deleted_at');
      return response;
}

const deleteAddress = async (personID, addressID) => {
    const returnObject = ['id','person_id','line1','line2','city','state','zip','created_at','updated_at','deleted_at'];
    const response = await database('addresses').returning(returnObject).where({'person_id': personID, 'id': addressID}).update({'deleted_at': moment().toISOString()});
    return response;
}

module.exports = {
    addPerson,
    getPerson,
    getPeople,
    addAddress,
    getAddress,
    getAddresses,
    deleteAddress,

}