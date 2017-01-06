# Connect-OpenERP

OpenERP v7.0 API.

## Install

``` bash
$ npm install connect-openerp --save
```

## Usage

``` js
// Connect
const OpenERP = require('connect-openerp');

// Connect to OpenERP Server
const oerp = new OpenERP('localhost', 8069);
oerp.connect('db_test');

var username = 'admin', password = 'admin';
oerp.login(username, password, function (err, uid) {
	if (err){
		console.log(err)
	} else {
		console.log('Uid Logged: ' + uid)
	}
});

```

``` js
// List Databases
odoo.listDatabases(function (err, dblist) {
	if (err)
		console.log(err)	
	else
		console.log(dblist)
});
``` 


## License

[ISC License][LICENSE]