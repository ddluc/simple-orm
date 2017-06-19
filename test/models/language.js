
var Model = require('../../src/model');

/**
 * @class
 * @description test model to represent language data
 */
class Language extends Model {

  constructor(id=null) {
    super();
    this._table= 'city';
    this._pk = 'id';
    this._model = {
      id: id,
      countryCode: '',
      language: '',
      percentage: 0
    };
  }

}

module.exports = Language;
