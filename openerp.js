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

OpenERP = function(host, port){
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
    // DATABASE
    this.rpc_db = xmlrpc.createClient({
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
        	hoag.logger.error('Error Connecting to OpenERP Server: ' + url, true);
        else
        	hoag.logger.info('Connecting sucessful to OpenERP Server: ' + url, true);
	});
};

// Test connection
var testConnection = function(callback){
    _TestConnection(this.host, this.port, callback);
};

// Check database is available
var checkDb = function(db_name, callback){
    _TestConnection(this.host, this.port, function (err, db_list) {
        var db_found = false;
        for (var i = 0; i < db_list.length; i++) {
            if (db_name == db_list[i])
                db_found = true;
        }
        callback(db_found);
    });
};

// List Databases
var listDatabases = function(callback){
    _TestConnection(this.host, this.port, callback);
};

// Method to set Database
var connect = function(db){
    this.db = db;
    this.url = 'http://' + this.host + ':' + this.port + '/' + this.db;
};

//Method to login user
var login = function(username, password, callback){	
	var url = this.url;
	this.username = username;
	this.password = password;			
	this.rpc_common.methodCall('login', [this.db, this.username, this.password], function (err, uid) {
		if (err)
			hoag.logger.error('Bad login: ' + this.url, true);
		else
			hoag.logger.info("Successful login: '" + username + "' IN " + url, hoag.logger_type);
		callback(err, uid);
	});
};

OpenERP.prototype = {
    connect: connect,
    login: login,
    testConnection: testConnection,
    checkDb: checkDb,
    listDatabases: listDatabases
};
module.exports = OpenERP