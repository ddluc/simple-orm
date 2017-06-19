/**
 * Database Service Class
 */

var _ = require('underscore'),
    Promise = require('bluebird'),
    uuid = require('uuid'),
    Database = require('./database'),
    logger = require('./util/logger'),
    error = require('./util/error');

/**
 * @class Model
 * @description data model base class
 */
class Model {

  /**
   * @constructor
   * @param {string} the table mapped to the model
   */
  constructor() {
    this.db = Database;
    this._pk = '';
    this._table = '';
    this._model = {};
    this._rel = {};
  }

  /**
   * @description retrieve the model data
   * @return {Object} returns either the specified model property, or entire model object
   */
  get model() {
    return this._model;
  }

  /**
   * @description retrieve the model relational data
   * @return {Object} rel
   */
  get rel() {
    return this._rel;
  }

  /**
   * @description retrieve the model primary key
   * @return {String} pk - the primary key column name
   */
  get pk() {
    return this._pk;
  }

  /**
   * @description retrieve the model table
   * @return {String} pk - the name of the table mapped to the model
   */
  get table() {
    return this._table;
  }


  /**
   * @description set the model data
   * @param {Object} property - key value pairs of properties to be set
   */
  set model(model) {
    for (let key in model) {
      if (!model.hasOwnProperty(key)) continue;
      this.model[key] = model[key];
    }
  }

  /**
   * @method
   * @description instanctiates a model instance from a given data object and model class
   * @param {Object} || {Array} - modelData - the data to set on the Model instance
   * @param {Class} - ModelClass - the class to instantiate
   * @returns {Class} || {Array}<Class>
   */
  static instantiate(modelData, ModelClass) {
    var result = null;
    if (modelData instanceof Array) {
      result = [];
      _.each(modelData, (data) => {
        var instance = new ModelClass();
        instance.model = data;
        result.push(instance);
      });
    } else {
      var instance = new ModelClass();
      instance.model = modelData;
      result = instance;
    }
    return result;
  }

  /**
   * @description loads a db entry from a given id and pk column name
   * @param {String | Number } id - the id of the entry. optional.
   * @param {String} pkColumn - the name of the primary key column
   * @returns {Promise}<Model> - the instance to the model
   * @throws {DatabaseError}
   */
  load(id) {
    return new Promise((resolve, reject) => {
      if (!this.model[this.pk]) reject(new error.ModelError('PRIMARY_KEY_NOT_SET'));
      var sql = `SELECT * FROM ${this.db.pool.escapeId(this.table)} WHERE ${this.db.pool.escapeId(this.pk)} = ?`;
      var query = this.db.pool.query(sql, [this.model[this.pk]], (err, results) => {
        if (err) {
          reject(new error.DatabaseError(err.code))
        } else {
          if (results.length > 0) {
            const [ data ] = results;
            this.model = data;
            resolve(this);
          }
          reject(new error.ModelError('NO_DATA_FOUND'));
        }
      });
    });
  }

  /**
   * @description inserts the model to the db
   * @return {Promise<Object>} returns model instance if it is successfully committed
   * @throws {DatabaseError}
   */
  insert() {
    return new Promise((resolve, reject) => {
      var sql = `INSERT INTO ${this.db.pool.escapeId(this.table)} SET ?`;
      var query = this.db.pool.query(sql, this._model, (err, result) => {
        if (err) {
          reject(new error.DatabaseError(err.code))
        } else {
          // handle auto increment ids
          if (this.model[this.pk] == null ) {
            this.model = { id: result.insertId }
          }
          resolve(this);
        }
      });
      logger.dev('Executing Query: ' + query.sql);
    });
  }

  /**
   * @description commits the model to the db
   * @return {Promise<Object>} returns model instance if it is successfully committed
   * @throws {DatabaseError}
   */
  update() {
    return new Promise((resolve, reject) => {
      var sql = `UPDATE ${this.db.pool.escapeId(this.table)} SET ? WHERE ${this.db.pool.escapeId(this.pk)} = ?`;
      var query = this.db.pool.query(sql, [this._model, this.model[this.pk]], (err, result) => {
        if (err) {
          reject(new error.DatabaseError(err.code))
        } else {
          resolve(this);
        }
      });
      logger.dev('Executing Query: ' + query.sql);
    });
  }

  /**
   * @description deletes the model from the db
   * @return {Promise<Object>} returns model instance if it is successfully committed
   * @throws {DatabaseError}
   */
  delete() {
    return new Promise((resolve, reject) => {
      var sql = `DELETE FROM ${this.db.pool.escapeId(this.table)} WHERE ${this.db.pool.escapeId(this.pk)} = ?`;
      var query = this.db.pool.query(sql, [this.model[this.pk]], (err, result) => {
        if (err) {
          reject(new error.DatabaseError(err.code));
        } else {
          resolve(true);
        }
      });
      logger.dev('Executing Query: ' + query.sql);
    });
  }


  /**
   * @description generate a new V4 uuid
   * @returns {string} uuid the uuid
   */
  uuid() {
    return uuid();
  }

  /**
   * @description generate a properly formated mysql datetimestamp
   * @return {String} properly formatted date string
   */
  now() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }


}

module.exports = Model;
