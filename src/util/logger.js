var colors = require('colors/safe');

var debug = false
if (process.env.ENV == 'development') {
  debug = true;
}

module.exports = {


  /**
   * @function log
   * @description standard log for production and security
   * @param {string} prefix - prefix the log with context (i.e. Database, Network)
   * @param {string} msg - the message to log
   */
  'info': function(msg="") {
    console.log(colors.green(msg));
  },

  /**
   * @function warning
   * @description standard log for dev and production
   * @param {string} msg - the message to log
   */
  'warn': function(msg) {
    console.log(colors.yellow(msg));
  },

  /**
   * @function error
   * @description error logs for development and production
   * @param {string} msg - the message to log
   */
  'error': function(msg) {
    console.log(colors.red.bold(msg));
  },

  /**
   * @function dev
   * @description development specific logs for
   * @param {string} msg - the message to log
   */
  'dev': function(msg) {
    if (debug) {
      console.log(colors.grey(msg));
    }
  }

}
