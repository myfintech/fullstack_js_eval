const moment = require('moment');
const statusCodes = require('../../../lib/httpStatusCodes')
const { database } = require('../../../lib/database')

/**
 * Creates an entity and sends it to client.
 *
 * @param {string} type
 *   Type of entity being created.
 * @param {object} content
 *   Content of the entity.
 * @param {object} res
 *   Express.js response object.
 **/
const create = (type, content, res) => {
  database(type)
    .insert(content)
    .returning('*')
    .then(([data]) => {
      res
        .type('application/json')
        .status(statusCodes.OK)
        .json(data)
    })
    .catch(error => {
      res
        .status(statusCodes.InternalServerError)
        .json()
    })
}

/**
 * Finds most relevant entity based on a criteria and sends it to client.
 *
 * @param {string} type
 *   Type of entity being created.
 * @param {object} criteria
 *   Object containing find criteria i.e { id: 33 }.
 * @param {object} res
 *   Express.js response object.
 **/
const find = (type, criteria, res) => {
  database(type)
    .select('*')
    .where(criteria)
    .whereNull('deleted_at')
    .then( ([data]) => {
      if (data){
        res
          .status(statusCodes.OK)
          .type('application/json')
          .json(data)
      } else {
        res
          .status(statusCodes.NotFound)
          .json()
      }
    })
    .catch (error => {
      res
        .status(statusCodes.InternalServerError)
        .json()
    })
}

/**
 * Searches for entities based on a criteria and sends entities to client.
 *
 * @param {string} type
 *   Type of entity being created.
 * @param {object} criteria
 *   Object containing search criteria i.e { company: 'Mantl', title: 'Application Engineer' }.
 * @param {object} res
 *   Express.js response object.
 **/
const search = (type, criteria, res) => {
  database(type)
    .select('*')
    .where(criteria)
    .whereNull('deleted_at')
    .then((data) => {
      if (data.length){
        res
          .status(statusCodes.OK)
          .type('application/json')
          .json(data)
      } else {
        res
          .status(statusCodes.NoContent)
          .json()
      }
    })
    .catch (error => {
      res
        .status(statusCodes.InternalServerError)
        .json()
    })
}

/**
 * Sets entities to deleted state based on a criteria.
 *
 * @param {string} type
 *   Type of entity being created.
 * @param {object} criteria
 *   Object containing search criteria.
 * @param {object} res
 *   Express.js response object.
 **/
const remove = (type, criteria, res) => {
  // Failsafe for when a client attempts to delete all entities.
  if (Object.keys(criteria).length === 0) {
    res
      .status(statusCodes.Unauthorized)
      .json()
  } else {
    database(type)
      .update({ 'deleted_at': moment().format() })
      .where(criteria)
      .then(() => {
        res
          .type('application/json')
          .status(statusCodes.OK)
          .json()
      })
      .catch(error => {
        res
          .status(statusCodes.InternalServerError)
          .json()
      })
  }
}

module.exports = {
  create,
  find,
  search,
  remove,
}
