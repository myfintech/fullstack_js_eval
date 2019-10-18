const statusCodes = require("./httpStatusCodes");
const httpErrorMessages = require("./httpErrorMessages");

module.exports = {
  /**
   * Responds to request with json. Status 200 by default
   * @param res Express res
   * @param data Data to be sent
   */
  json: (res, data) => {
    return res.status(statusCodes.OK).json(data);
  },
  /**
   * Responds to request with error and json.
   * @param res Express res
   * @param {Error} error
   */
  error: (res, error = {}) => {
    switch (error.name) {
      case "NotImplemented":
        return res
          .status(statusCodes.NotImplemented)
          .json(httpErrorMessages.NotImplemented);
      case "NotFound":
        return res
          .status(statusCodes.NotFound)
          .json(httpErrorMessages.NotFound);
      case "InvalidArgument":
        return res
          .status(statusCodes.BadRequest)
          .json(httpErrorMessages.BadRequest);
      default:
        return res
          .status(statusCodes.InternalServerError)
          .json(httpErrorMessages.InternalServerError);
    }
  }
};
