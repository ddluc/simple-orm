/**
 * @file src/database.js
 * @author Daniel Lucas
 */

var mysql = require("mysql"),
    logger = require("./util/logger");

/**
 * @class
 * @description singleton class to manage DB connections
 * @todo return errors if connections can't be established
 */
class Database {

    /**
     * @constructor
     */
    constructor() {
      this.debug = false;
      this.config = {};
      this.pool = null;
    }

    /**
     * @method
     * @description sets the database configuration
     * @param {Object} config - the configuration options
     */
    init(config, debug=false, createPool=true) {
      this.debug = debug;
      this.config = config;
      if (createPool) {
        this.createPool();
      }
    }

    /**
     * @method
     * @description creates a new mysql connection
     * @returns {Object} connection - a new database connection
     */
    createConnection() {
      return mysql.createConnection(this.config);
    }

    /**
     * @method
     * @description creates a new mysql connection pool
     * @returns {Object} pool - a new database connection pool instance
     */
    createPool() {
      this.pool = mysql.createPool(this.config);
      if (this.debug) {
        this.logPoolEvents();
      }
      return this.pool;
    }

    /**
     * @method
     * @description logs events for the connection pool
     */
    logPoolEvents() {
      // event fired when a new connection is acquired from the pool
      this.pool.on('acquire', (connection) => {
        logger.dev(`Connection ${connection.threadId} acquired`);
      });
      // event fired when a connection has been established
      this.pool.on('connection', (connection) => {
        logger.dev(`Connection ${connection.threadId} connected`);
      });
      // event fired when a class is waiting for a connection
      this.pool.on('enqueue', () =>  {
        logger.dev('Waiting for available connection slot');
      });
      // event fired when
      this.pool.on('release', (connection) => {
        logger.dev(`Connection ${connection.threadId} released`);
      });
    }


}

module.exports = new Database();
