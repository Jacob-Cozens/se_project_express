const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const DEFAULT = 500;
const CONFLICT_ERROR = 409;
const FORBIDDEN = 403;

class DuplicateError extends Error {
  constructor(message) {
      super(message);
      this.name = "DuplicateError"; // Custom name for the error
  }
}

module.exports = { BAD_REQUEST, NOT_FOUND, DEFAULT, CONFLICT_ERROR, FORBIDDEN, DuplicateError };
