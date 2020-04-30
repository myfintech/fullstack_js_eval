const moment = require('moment')

module.exports = {
    fromReqToDbModel: (reqBody) => {
        const { first_name, last_name,birthday, company, title, created_at} = reqBody
        return {first_name, last_name, birthday, company, title, created_at}
    },
    fromReqBodyWithId: (id, reqBody) => {
        const { first_name, last_name,birthday, company, title, created_at} = reqBody
        return {id, first_name, last_name, birthday, company, title, created_at}
    },
    fromListOfDbModelsToApiModels: (listOfDbPeople) => {

        return listOfDbPeople.map(person => {
            const {first_name, last_name, birthday, company, title, id, created_at} = person
            return {first_name, last_name, company, title, created_at, id: [id], birthday: moment(birthday).format('YYYY-MM-DD')}
        })
    }
}