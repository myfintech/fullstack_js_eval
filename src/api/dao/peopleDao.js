
const { database } = require('../lib/database')
const adapters = require('../adapters/peopleAdapters')

const fromReqToDbModel = (reqBody) => {
    const { first_name, last_name,birthday, company, title, created_at} = person
    return {first_name, last_name, birthday, company, title, created_at}
}

const insert = (person) => {
    return new Promise((resolve, reject) => {
        return database('people')
        .insert(adapters.fromReqToDbModel(person))
        .returning('id')
        .then(resolve)
        .catch(reject)
    })
}

module.exports = {
    Insert: insert
}