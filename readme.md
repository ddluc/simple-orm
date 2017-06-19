# Simple ORM

A promise based ORM for node.js and mysql databases. A work in progress.


### Setup

1. Install dependencies:
```
$ npm install
```

2. Set development environment environment variables (without brackets)
```
$ export ENV=[environment]
$ export DB_USER=[username]
$ export DB_PASS=[password]
```

3. Run Tests:
```
$ npm run test
```

### Usage

This is a simple example of how the models are used.

1. Define a Model

```js
class Country extends Model {

  constructor(code='') {
    super();
    this._table= 'country';
    this._pk = 'code';
    this._model = {
      code: code,
      name: '',
      continent: '',
      ...
    };
    this._rel = {
      cities: [],
      languages: []
    };
  }

}
```

2. Initialize Database

```js
const config = { host: 'localhost', database: 'world', user: process.env.DB_USER, password: process.env.DB_PASS };
Database.init(config);
```

3. Execute a query
```js
const id = 'ARM';
country = new Country(id);
country.load().then((country) => {
   // country.model ==> {  code: 'ARM', name: 'Armenia', continent: 'Asia' .. }
}).catch((err) => {
  console.log(err);
});
```
