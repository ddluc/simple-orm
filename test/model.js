
const assert = require("assert");
const error = require('../src/util/error');
const Country = require("./models/country");
const City = require('./models/city');
const Model = require("../src/model");
const Database = require("../src/database");

module.exports = function() {

  /**
   * NOTE: All tests assume that a valid model object was defined
   * see /test/model/ for the models used for these tests
   */

   let countryData = {
     code: 'USA',
     name: 'United States',
     continent: 'North America',
     region: 'North America',
     surfaceArea: '9363520.00',
     indepYear: 1776,
     population: 278357000,
     lifeExpectancy: 77.1,
     gnp: 8510700.00,
     gnpOld: 8110900.00,
     localName: 'United States',
     governmentForm: 'Federal Republic',
     headOfState: 'George W. Bush',
     capital: 3813,
     code2: 'US'
   };

   let cityData = {
     countryCode: 'USA',
     name: 'Portland',
     district: 'Oregon',
     population: 800000
   };

  // Initialize Database connection
  const config = { host: 'localhost', database: 'world', user: process.env.DB_USER, password: process.env.DB_PASS };
  Database.init(config);

  describe('Model', () => {

    describe('#constructor',  () => {
      it('should create a new model instance with default properties and a db connection', () => {
        var country = new Country();
        assert(country instanceof Model);
      });
    });

    describe('#getters', () => {
      it('should retrieve the model data', () => {
        var country = new Country();
        assert(country.model &&  typeof country.model === 'object');
      });
      it('should retrieve the model table name', () => {
        var country = new Country();
        assert(country.table && country.table === 'country');
      });
      it('should retrieve the model primary key', () => {
        var country = new Country();
        assert(country.pk && country.pk === 'code');
      });
      it('should retrieve the model relational data', () => {
        var country = new Country();
        assert(country.rel && typeof country.rel === 'object');
      });
    });

    describe('#instantiate', () => {
      it('should instantiate a new Model instance from a data object and model class', () => {
        var countryData = { code: 'ARM', name: 'Armenia', population: 120000 };
        var country = Model.instantiate(countryData, Country);
        assert(country instanceof Country);
        assert.equal(country.model.code, countryData.code);
        assert.equal(country.model.name, countryData.name);
        assert.equal(country.model.population, countryData.population);
      });
      it('should instantiate a collection of Model instances from an array of data and model class ', () => {
        var countryData = [
          { code: 'ARM', name: 'Armenia', population: 120000 },
          { code: 'USA', name: 'United State', population: 400000000 },
          { code: 'ITL', name: 'Italy', population: 20000000 }
        ];
        var countries = Model.instantiate(countryData, Country);
        assert.equal(countries.length, 3);
        for (var i = 0; i < countryData.length; i++) {
          assert(countries[i] instanceof Country);
          assert.equal(countries[i].model.code, countryData[i].code);
          assert.equal(countries[i].model.name, countryData[i].name);
          assert.equal(countries[i].model.population, countryData[i].population);
        };
      });
    });

    describe('#load', () => {
      it('should throw a ModelError if no primary key value is set on the model', () => {
        var code = null;
        var country = new Country(code);
        return country.load().catch((err) => {
          assert(err && err instanceof error.ModelError);
          assert(err.code === 'PRIMARY_KEY_NOT_SET');
        });
      });
      it('should throw a ModelError if no record is found', () => {
        var code = 'XXX';
        var country = new Country(code);
        return country.load().catch((err) => {
          assert(err && err instanceof error.ModelError);
          assert.equal(err.code, 'NO_DATA_FOUND');
        });
      });
      it('should load the record cooresponding to given primary key value', () => {
        const code = 'ARM';
        var country = new Country(code);
        return country.load().then((country) => {
          assert.equal(country.model.code, code);
        });
      });
    });

    describe('#insert', () => {
      it('should throw a DatabaseError if a record with existing primary key exists', () => {
        var country = new Country();
        country.model = countryData;
        return country.insert().catch((err) => {
          assert(err && err instanceof error.DatabaseError);
          assert.equal(err.code, 'ER_DUP_ENTRY');
        });
      });
      it('should throw a DatabaseError if the model is invalid', () => {
        var country = new Country();
        country.model = countryData;
        country.model = { code: 'XXX', population: 'hello' };
        return country.insert().catch((err) => {
          assert(err && err instanceof error.DatabaseError);
        });
      });
      it('should insert a valid model instance to the db if the model record does not exist', () => {
        var country = new Country();
        country.model = countryData;
        const code = 'XXX';
        country.model = { code };
        return country.insert().then((country) => {
          assert(country);
          assert.equal(country.model.code, code);
          // ASSERT: verify query using node-mysql
        });
      });
      it ('should insert a valid model instance with an auto increment primary key', () => {
        var city = new City(4080);
        city.model = cityData;
        return city.insert().then((city) => {
          assert(city);
          assert.notEqual(city.model.id, null);
          assert.equal(city.model.id, 4080);
        });
      })
    });

    describe('#update', () => {
      it('should throw a DatabaseError if the model record does not exist', () => {
        var code = 'XXX';
        var country = new Country(code);
        return country.update().catch((err) => {
          assert(err && err instanceof error.DatabaseError);
        });
      });
      it('should throw a DatabaseError if the model is invalid', () => {
        var country = new Country();
        country.model = countryData;
        country.model = { code: 'XXX', population: 'hello' };
        return country.update().catch((err) => {
          assert(err && err instanceof error.DatabaseError);
        });
      });
      it('should update the model record', () => {
        var country = new Country();
        country.model = countryData;
        const name = 'Fuck You Trump';
        country.model = { name };
        return country.update().then((country) => {
          assert(country);
          assert.equal(country.model.name, name);
          // ASSERT: verify query using node-mysql
        });
      });
    });

    describe('#delete', () => {
      it('should throw a DatabaseError if the model record does not exist', () => {
        var code = 'XXX';
        var country = new Country(code);
        return country.delete().catch((err) => {
          assert(err && err instanceof error.DatabaseError);
        });
      });
      it('should delete the model record', () => {
        var city = new City();
        city.model = cityData;
        return city.delete().then((success) => {
          assert(success);
        });
      });
    });

    describe('#uuid', () => {
      it('should generate a new uuid', () => {
        var model = new Model();
        const uuid = model.uuid();
        assert(typeof uuid === 'string');
      });
    });

    describe('#now', () => {
      it('should return a new date object', () => {
        var model = new Model();
        const date = model.now();
        assert(typeof date === 'string');
        // ASSSET: Is formatted properly
      });
    });

  });

}
