/**
 * Custom Error classes
 */

 class ErrorBase extends Error {
   constructor(code) {
     super();
     this.code = code;
     this.stack = (new Error()).stack;
     this.name = this.constructor.name;
   }
 }


class DatabaseError extends ErrorBase {
  constructor(code) {
    super(code);
  }
}

class ModelError extends ErrorBase {
  constructor(code) {
    super(code);
  }
}

class QueryError extends ErrorBase {
  constructor(code) {
    super(code);
  }
}


module.exports = { DatabaseError, ModelError, QueryError }
