
const assert = require('assert');
const error = require('../src/util/error');
const Country = require("./models/country");
const City = require('./models/city');
const Language = require('./models/language');
const Model = require('../src/model');
const Query = require('../src/query');
const Database = require('../src/database');


module.exports = function() {

  describe('Query', () => {

    describe('#constructor', () => {
      it('should initialize a new Query instance from given Model class', () => {
        var query = new Query(Country);
        assert.equal(query._table, 'country');
        assert.equal(query._Model, Country);
        assert.equal(query._returnType, 'class');
      });
      it('should initialize a new Query instance from given table', () => {
        var query = new Query('country');
        assert.equal(query._table, 'country');
        assert.equal(query._returnType, 'data');
      });
    });

    describe('#exec', () => {
      it('should throw a DatabaseError if table does not exist', () => {
        const table = 'foo';
        var query = new Query(table);
        return query.exec().catch((err) => {
          assert(err);
          assert.equal(err.code, 'ER_NO_SUCH_TABLE');
        });
      });
      it('should execute base query if no options are set', () => {
        const table = 'country';
        var query = new Query(table);
        return query.exec().then((results) => {
          assert.equal(results.length, 239);
          assert.equal(query.sql, 'SELECT * FROM `country`');
        });
      });
      it('should return an array of class instance when returnType is set to class', () => {
        var query = new Query(Country);
        return query.exec().then((results) => {
          for (let result of results) {
            assert(result instanceof Country);
            assert(result.model.code);
          }
        });
      });
      it('should return an array of objects when returnType is set to data', () => {
        var query = new Query('country');
        return query.exec().then((results) => {
          for (let result of results) {
            assert(result.code);
          }
        });
      });
    });

    describe('#columns', () => {
      it('should set which columns to select when provided an array of column names', () => {
        var query = new Query('country');
        const columns = ['code', 'name', 'continent', 'region'];
        query.columns(columns);
        assert.equal(query._columns, columns);
      });
      it('should not set which columns to select when not provided an array', () => {
        var query = new Query('country');
        let columns = 'hello';
        query.columns(columns);
        assert.equal(query._columns, null);
        columns = 100;
        query.columns(columns);
        assert.equal(query._columns, null);
      });
      it('should only return the specified columns when executed', () => {
        var query = new Query('country');
        const columns = ['code', 'name', 'continent', 'region'];
        return query.columns(columns).exec().then((results) => {
          for (let result of results) {
            assert(result.code);
            assert(result.name);
            assert(result.continent);
            assert(result.region);
            assert.equal(result.surfaceArea, undefined);
            assert.equal(result.population, undefined);
            assert.equal(result.gnp, undefined);
          }
        });
      });
    });

    describe('#where', () => {
      it('should add a where clause to the query', () => {
        var query = new Query('country');
        const filter = {code: 'ARM'};
        query.where(filter);
        assert.equal(query._where, filter);
      });
      it('should only retrieve results that match the specified condition when executed', () => {
        var query = new Query('country');
        const filter = {region: 'Middle East'};
        query.where(filter).exec().then((results) => {
          for (result of results) {
            assert(result.code);
            assert.equal(result.region, filter.region);
          }
        });
      });
    });


    describe('#orderBy', () => {
      it('should add an order by clause to the query', () => {
        var query = new Query('country');
        query.orderBy('surfaceArea');
        assert.equal(query._orderBy, 'surfaceArea');
      });
      it('should order the results by the specified column when executed', () => {
        var query = new Query('country');
        query.orderBy('surfaceArea').exec().then((results) => {
          assert(results[0].surfaceArea, 0.40);
          assert(results[0].name, 'Holy See (Vatican City State)');
        });
      });
    });

    describe('#sort', () => {
      it('should add a sort clause to the query if there is an orderby clause', () => {
        var query = new Query('country');
        query.sort('DESC');
        assert.equal(query._sort, null);
        query.orderBy('surfaceArea');
        query.sort('DESC');
        assert.equal(query._sort, 'DESC');
      });
      it('should sort the results decendingly when executed', () => {
        var query = new Query('country');
        query.orderBy('surfaceArea').sort('DESC').exec().then((results) => {
          assert(results[0].surfaceArea, 17075400.00);
          assert(results[0].name, 'Russian Federation');
        });
      });
    });

    describe('#groupBy', () => {
      it('should add a group by clause to the query', () => {
        var query = new Query('countrylanguage');
        var groupBy = 'language';
        query.groupBy(groupBy);
        assert.equal(query._groupBy, groupBy);
      });
      it('should group the results by the specified column when executed', () => {
        var query = new Query('countrylanguage');
        var columns = ['COUNT(countrycode) as languageCount', 'language'];
        var groupBy = 'language';
        var orderBy = 'languageCount'
        query.columns(columns).groupBy(groupBy).orderBy(orderBy).sort('DESC').exec().then((results) => {
          assert.equal(results[0].language, 'English');
          assert.equal(results[0].languageCount, 60);
          assert.equal(results[1].language, 'Arabic');
          assert.equal(results[1].languageCount, 33);
        });
      });
    });


    describe('#limit', () => {
      it('should add a limit clause to the query', () => {
        assert(false);
      });
      it('should limit the results to the specified number when executed', () => {
        assert(false);
      });
    });

    describe('#offset', () => {
      it('should add an offset clause to the query', () => {
        assert(false);
      });
      it('should offset the query when executed', () => {
        assert(false);
      });
    });

  });

}
