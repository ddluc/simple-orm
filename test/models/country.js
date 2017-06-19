
var Model = require('../../src/model');

/**
 * @class
 * @description test model to represent country data
 */
class Country extends Model {

  constructor(code='') {
    super();
    this._table= 'country';
    this._pk = 'code';
    this._model = {
      code: code,
      name: '',
      continent: '',
      region: '',
      surfaceArea: 0,
      indepYear: 0,
      population: 0,
      lifeExpectancy: 0,
      gnp: 0,
      gnpOld: 0,
      localName: '',
      governmentForm: '',
      headOfState: '',
      capital: 0,
      code2: ''
    };
    this._rel = {
      cities: [],
      languages: []
    };
  }

}

module.exports = Country;
