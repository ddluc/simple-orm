/**
 * Database Service Class
 */

var _ = require('underscore'),
    Promise = require('bluebird'),
    Database = require('./database'),
    logger = require('./util/logger'),
    error = require('./util/error');

/**
 * @class Query
 * @description query the database
 */
class Query {

  /**
   * @constructor
   * @param {Model | String} either a Model instance or string
   * @type {[type]}
   */
  constructor(Model=null) {
    // the database instance
    this.db = Database;
    if (typeof Model === 'function') {
      // the model class to attach the model to
      this._Model = Model;
      // the table to execute query on
      this._table = new Model().table;
      // identifies is the query returns a model instance, or data object
      this._returnType = 'class';
    } else {
      this._Model = null;
      // the table to execute query on
      this._table = Model;
      // identifies is the query returns a model instance, or data object
      this._returnType = 'data';
    }
    // the results array
    this._results = [];
    // the sql that was executed
    this._sql = null;
    // sql query default options
    this._columns = null;
    this._where = null;
    this._orderBy = null;
    this._groupBy = null;
    this._sort = 'ASC';
    this._limit = null;
    this._offset = null;
  }

  /**
   * @description returns object from the database
   * @return {Promise<Array>} returns an array of models found by the query
   */
  exec() {
    return new Promise((resolve, reject) => {
      var sql = 'SELECT ';
      // specify columns to select, if provided
      if (this._columns) {
        _.each(this._columns, (column, index) => {
          if (index == 0) {
            sql = sql + column;
          } else {
            sql = sql + ', ' + column;
          }
        });
      // if no colunns are provided, select all columns
      } else {
        sql = sql + '*';
      }

      sql = sql + ' FROM ' + this.db.pool.escapeId(this._table);

      // construct appropriate sql clauses
      if (this._where) {
        sql = sql + ' WHERE '
        _.each(this._where, (value, key) => {
          sql = sql + this.db.pool.escapeId(key) + ' = ' + this.db.pool.escape(value);
        });
      }
      if (this._groupBy) {
        sql = sql + ' GROUP BY ' + this.db.pool.escapeId(this._groupBy);
      }
      if (this._orderBy) {
        sql = sql + ' ORDER BY ' + this.db.pool.escapeId(this._orderBy) + ' ' + this._sort;
      }
      if (this._limit) {
        sql = sql + ' LIMIT ' + this.db.pool.escape(this._limit)
        if (this._offset) {
          sql = sql + ',' + this.db.pool.escape(this._offset);
        }
      }

      // execute the query
      var query = this.db.pool.query(sql, (err, results) => {
        if (err) {
          logger.dev('Datbase Error: ' + err);
          reject(new error.DatabaseError(err.code))
        } else {
          this.sql = query.sql;
          if (this._returnType == 'class') {
            _.each(results, (data, index) => {
                var model = new this._Model();
                _.each(data, (value, prop) => {
                  model.model[prop] = data[prop]
                });
                this._results.push(model);
            });
            resolve(this._results);
          } else if (this._returnType == 'data') {
            this._results = results;
            resolve(this._results);
          } else {
            reject(new error.DatabaseError('Invalid return type: ' + this._return));
          }
        }
      });
      logger.dev('Executing Query: ' + sql);
    });
  }

  /**
   * @description set the query columns
   * @param {Array} value - array of column names
   */
  columns(value) {
    if (value instanceof Array) {
      this._columns = value;
    }
    return this;
  }

  /**
   * @description add where clause to query
   * @param {object} value - dictionary of columns and values
   */
  where(value) {
    // TODO: add operator param to where clause
    if (typeof value == 'object') {
      this._where = value;
    }
    return this;
  }

  /**
   * @description add an group by clause to the query
   * @param {string} value - column name to group by
   */
  groupBy(value) {
    this._groupBy = value;
    return this;
  }

  /**
   * @description add an order by clause to the query
   * @param {string} value - column name to order the results by
   */
  orderBy(value) {
    this._orderBy = value;
    return this;
  }

  /**
   * @description add a sort clause to the query
   * @param {string} value - either 'ASC' or 'DESC'
   */
  sort(value) {
    if (value == 'ASC' || 'DESC') {
      this._sort = value;
    }
    return this;
  }

  /**
   * @description add a limit clause to the query
   * @param {number} value - limit value
   */
  limit(value) {
    if (typeof value == 'number') {
      this._limit = value;
    }
    return this;
  }

  /**
   * @description add an offset (page) to the limit
   * @param {string} value - offset value
   */
  offset(value) {
    if (typeof value == 'number') {
      this._offset = value;
    }
    return this;
  }

}

module.exports = Query;
