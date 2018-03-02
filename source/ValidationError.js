/**
 * Custom error message for validation error
 *
 * @namespace ValidationError
 * @class
 * @param {number} statusCode - http status code
 * @param {string} statusText - http status code text
 * @param {string | null} [message = null] - error details
 */
export default class ValidationError extends Error {
  /**
   * Constructor generates error instance
   * @memberof ValidationError
   * @constructor
   * @param {number} statusCode - http status code
   * @param {string} statusText - http status code text
   * @param {string | null} [message = null] - error details
   * @return {ValidationError} - current instance
   */
  constructor(statusCode, statusText, message = null) {
    super(message);
    this.name = 'Validation Error';
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.message = message;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    } else {
      this.stack = new Error().stack;
    }
  }
}
