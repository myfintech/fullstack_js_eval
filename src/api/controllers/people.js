const moment = require('moment')

const statusCodes = require('../lib/httpStatusCodes')
const httpErrorMessages = require('../lib/httpErrorMessages')
const { database } = require('../lib/database')

async function createPerson(req, res, next) {

  // person is the posted body
  const person = {
    ...req.body,
  };

  const id = (await database.table('people').insert(person, ['id']))[0].id;

  // set the id in the person now that we have it from the db after insert
  person.id = id;

  res
    .status(statusCodes.OK)
    .json(person)
}



async function getPerson(req, res) {

  // get the person from the db with the personID
  const people = await database.select('*').from('people').where({ id: req.params.personID });

  // if we didn't find the person return 404
  if (!people.length) {
    res
      .status(statusCodes.NotFound)
      .json({});
    return;
  }

  // we found the person
  const person = people[0];

  // format the date
  person.birthday = moment(person.birthday).format('YYYY-MM-DD');

  // remove these props for some reason
  delete person.updated_at;
  delete person.deleted_at;

  res
    .status(statusCodes.OK)
    .json(person)
}




async function getAllPeople(req, res) {

  // get all the people from the db
  const people = await database.select('*').from('people');

  res
    .status(statusCodes.OK)
    .json(people)

}




module.exports = {
  getPerson,
  getAllPeople,
  createPerson,
}