var xmlrpc = require('xmlrpc');
var hoag = require('hoag');

var _TestConnection = function (host, port, callback) {
	var rpc_db = xmlrpc.createClient({
    	host: host,
        port: port,
        path:'/xmlrpc/db'
    });
    rpc_db.methodCall('list', [], callback);
};

Odoo = function(host, port){
	var url = 'http://' + host + ':' + port;
	this.url = url
	this.host = host;
	this.port = port;

	// COMMON
    this.rpc_common = xmlrpc.createClient({
    	host: this.host,
        port: this.port,
        path:'/xmlrpc/common'
    });
    // OBJECT
    this.rpc_object = xmlrpc.createClient({
    	host: this.host,
        port: this.port,
        path:'/xmlrpc/object'
    });
    // REPORT
    this.rpc_report = xmlrpc.createClient({
    	host: this.host,
        port: this.port,
        path:'/xmlrpc/report'
    });
    _TestConnection(this.host, this.port, function(err, db_list){        
        if (err)
        	hoag.logger('Error Connecting to Odoo Server: ' + url, hoag.logger_type.error, true);
        else
        	hoag.logger('Connecting sucessful to Odoo Server: ' + url, hoag.logger_type.info, true);
	});
};

// Method to set Database
var connect = function(db){
    this.db = db;
};

//Method to login user
var login = function(username, password, callback){	
	var url = this.url;
	this.username = username;
	this.password = password;			
	this.rpc_common.methodCall('login', [this.db, this.username, this.password], function (err, uid) {
		if (err)
			hoag.logger('Bad login: ' + this.url, hoag.logger_type.error, true);
		else
			hoag.logger("Successful login: '" + username + "' IN " + url, hoag.logger_type.info);		
		callback(err, uid);
	});
};

Odoo.prototype = {
    connect: connect,
    login: login,
};
module.exports = Odoo