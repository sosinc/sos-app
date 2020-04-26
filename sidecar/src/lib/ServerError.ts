/**
 * This extends the native Error object.
 * The native Error object's constructor only allows for a single message
 * This allows one to pass in more parameters (eg. HTTP status code)
 *
 * @param {string} message
 * @param {object} params All other params ("message" will override message)
 */
export default class ServerError extends Error {
  constructor(message: string, params = {}) {
    super(message);
    this["data"] = {};

    Object.keys(params)
      .filter(param => params[param] != null)
      .forEach(param => {
        this[param] = params[param];
        this["data"][param] = params[param];
      });
  }
}
