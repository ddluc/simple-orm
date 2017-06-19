
var Model = require('../../src/model');

/**
 * @class
 * @description test model to represent city data
 */
class City extends Model {

  constructor(id=null) {
    super();
    this._table= 'city';
    this._pk = 'id';
    this._model = {
      id: id,
      name: '',
      countryCode: '',
      district: '',
      population: 0
    };
  }

}

module.exports = City;
