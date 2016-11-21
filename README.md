# Connect-Odoo

Odoo API.

## Install

``` bash
$ npm install connect-odoo --save
```

## Usage

``` js
// app.js

const Odoo = require('connect-odoo');

// Connnect to Odoo Server
const odoo = new Odoo('localhost', 8069);
odoo.connect('db_test');

var username = 'admin', password = 'admin';
odoo.login(username, password, function (err, uid) {
	if (err){
		console.log(err)
	} else {
		console.log('Uid Logged: ' + uid)
	}
});

```



## License

[ISC License][LICENSE]