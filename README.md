# Connect-OpenERP

OpenERP 7.0 API.

## Install

``` bash
$ npm install connect-openerp --save
```

## Usage

``` js
// app.js

const OpenERP = require('connect-openerp');

// Connect to OpenERP Server
const openerp = new openerp('localhost', 8069);
openerp.connect('db_test');

var username = 'admin', password = 'admin';
openerp.login(username, password, function (err, uid) {
	if (err){
		console.log(err)
	} else {
		console.log('Uid Logged: ' + uid)
	}
});

```



## License

[ISC License][LICENSE]