const statusCodes = require('../../../lib/httpStatusCodes')
const httpErrorMessages = require('../../../lib/httpErrorMessages')
const repository = require('./repository');

const addPerson = async (req, res) => {
    try {
        const response = await repository.addPerson(req);
        return res
          .status(statusCodes.OK)
          .json(response[0]); 
  
      } catch (error) {
        console.log('error',error);
        res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      }
}

const getPerson = async (req, res) => {
    const personID = req.params.personID;
    try {
      const response = await repository.getPerson(personID);
      if (response.length > 0) {
        return res
          .status(statusCodes.OK)
          .json(response[0])
      } else {
        return res
          .status(statusCodes.NotFound)
          .json()
      }
    } catch (error) {
      console.log('error',error);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }
}

const getPeople = async (req, res) => {
    try {
        const response = await repository.getPeople();
        res
          .status(statusCodes.OK)
          .json(response)
      } catch (error) {
        console.log('error',error);
        res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)    
      }
}

const addAddress = async (req, res) => {
    try {
        const response = await repository.addAddress(req);
        return res
          .status(statusCodes.OK)
          .json(response[0]); 
  
      } catch (error) {
        console.log('error',error);
        res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError)
      }
}

const getAddress = async (req, res) => {
    const personID = req.params.personID;
    const addressID = req.params.addressID;
    try {
      const response = await repository.getAddress(personID, addressID);
      if (response.length > 0) {
        return res
          .status(statusCodes.OK)
          .json(response[0])
      } else {
        return res
          .status(statusCodes.NotFound)
          .json()
      }
    } catch (error) {
      console.log('error',error);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }
}

const getAddresses = async (req, res) => {
    const personID = req.params.personID;
    try {
      const response = await repository.getAddresses(personID);
      return res
        .status(statusCodes.OK)
        .json(response)
    } catch (error) {
      console.log('error',error);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }
}

const deleteAddress = async (req, res) => {
    const personID = req.params.personID;
    const addressID = req.params.addressID;
    try {
      const response = await repository.deleteAddress(personID, addressID);
      return res
        .status(statusCodes.OK)
        .json(response[0])
    } catch (error) {
      console.log('error',error);
      return res
        .status(statusCodes.InternalServerError)
        .json(httpErrorMessages.InternalServerError)
    }
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