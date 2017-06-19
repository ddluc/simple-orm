/**
 * @file index.js
 */

// TODO: write unit tests
// TODO: setup Joi schema validation
// TODO: remove underscore as a dependency
// TODO: convert all string concatenation to es6 template strings
// TODO: add linter and adhere to a js styleguide
// TODO: setup Travis CI
// TODO: write documentation
// TODO: add support for composite primary keys


var Database = require('./src/database');
var Query = require('./src/query');
var Country = require('./tests/models/country');

const config = { host: 'localhost', database: 'world', user: process.env.DB_USER, password: process.env.DB_PASS };

const debug = true;
Database.init(config, debug);

const id = 'ARM';
country = new Country(id);
country.load().then((country) => {
  console.log(country.model);
}).catch((err) => {
  console.log(err);
  console.log('------- Error ------')
})


var query = new Query(Country);
query.exec().then((data) => {
  debugger;
}).catch((err) => {
  debugger;
});
