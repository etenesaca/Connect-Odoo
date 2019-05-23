#!/usr/bin/env node

"use strict";

var xmlrpc = require('xmlrpc');
var hoag = require('hoag');

var getDbList = function(protocol, host, port) {
    return new Promise(function(resolve, reject) {
        var rpc_db = xmlrpc.createClient({
            host: host,
            port: port,
            path: '/xmlrpc/db'
        });
        if (protocol == 'https') {
            rpc_db.isSecure = true;
        }
        rpc_db.methodCall('list', [], function(err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

var OpenERP = function(protocol, host, port, db) {
    this.protocol = protocol;
    this.host = host;
    this.port = port;
    this.url = hoag.strings.formatJson("{protocol}://{host}:{port}", {
        protocol: protocol,
        host: host,
        port: port
    });
    if (db) {
        this.db = db;
        this.url = this.url + '/' + this.db;
    }

    // COMMON
    this.rpc_common = xmlrpc.createClient({
        host: this.host,
        port: this.port,
        path: '/xmlrpc/common'
    });
    // OBJECT
    this.rpc_object = xmlrpc.createClient({
        host: this.host,
        port: this.port,
        path: '/xmlrpc/object'
    });
    // DATABASE
    this.rpc_db = xmlrpc.createClient({
        host: host,
        port: port,
        path: '/xmlrpc/db'
    });
    // REPORT
    this.rpc_report = xmlrpc.createClient({
        host: this.host,
        port: this.port,
        path: '/xmlrpc/report'
    });
    if (protocol == 'https') {
        this.rpc_common.isSecure = true;
        this.rpc_object.isSecure = true;
        this.rpc_db.isSecure = true;
        this.rpc_report.isSecure = true;
    }
};

// List Databases
var listDatabases = () => getDbList(this.protocol, this.host, this.port);
// Test Connection
var testConnection = function() {
    var protocol = this.protocol;
    var host = this.host;
    var port = this.port;
    return new Promise(function(resolve, reject) {
        getDbList(protocol, host, port)
            .then(result => {
                resolve(result && true || false)
            })
            .catch((err) => resolve(false))
    })
};
// Check database is available
var checkDb = function(db_name) {
    return new Promise(function(resolve, reject) {
        this.listDatabases()
            .then(dbList => {
                var db_found = false;
                for (var i = 0; i < db_list.length; i++) {
                    if (db_name == db_list[i])
                        db_found = true;
                }
                resolve(db_found);
            })
            .catch(err => reject(err))
    });
};
//Method to login user
var login = function(username, password, db) {
    if (db)
        this.db = db;
    var db = this.db;
    this.username = username;
    this.password = password;
    return new Promise(function(resolve, reject) {
        this.rpc_common.methodCall('login', [db, username, password], function(err, uid) {
            if (err) return reject(err)
            this.uid = uid; // SET USER ID
            resolve(uid);
        });
    })
};
// Set Credentials Exists Previous Login Information
var setUID = function(username, uid, password) {
    this.username = username;
    this.uid = uid;
    this.password = password;
};

/*
EXECUTE ORM METHODS
*/
var execObject = function(model, method) {
    var rpc_object = this.rpc_object;
    var params = [this.db, this.uid, this.password]
    hoag.logger.info(`OpenERP Connecting ${this.url} || model:${model}/${method}`)
    for (var i in arguments)
        params.push(arguments[i]);
    return new Promise(function(resolve, reject) {
        rpc_object.methodCall('execute', params, function(err, result) {
            if (err) return reject(err)
            resolve(result);
        });
    });
};
var search = function(model, args, offset, limit, order, context) {
    offset = offset && !isNaN(parseFloat(offset)) && isFinite(offset) && parseInt(offset) || 0;
    limit = limit && !isNaN(parseFloat(limit)) && isFinite(limit) && parseInt(limit) || null;
    order = order || '';
    context = context || {};
    return this.execObject(model, 'search', args, offset, limit, order, context)
};
var create = function(model, values, context) {
    context = context || {};
    return this.execObject(model, 'create', values, context)
};
var write = function(model, ids, values, context) {
    ids = typeof ids == 'number' && [ids] || ids;
    context = context || {};
    return this.execObject(model, 'write', ids, values, context)
};
var read = function(model, ids, fields, context) {
    fields = fields || [];
    context = context || {};
    return this.execObject(model, 'read', ids, fields, context)
};
var unlink = function(model, ids, values) {
    ids = typeof ids == 'number' && [ids] || ids;
    context = context || {};
    return this.execObject(model, 'unlink', ids, context)
};

OpenERP.prototype = {
    testConnection: testConnection,
    listDatabases: listDatabases,
    login: login,
    setUID: setUID,
    checkDb: checkDb,
    // ORM METHODS
    execObject: execObject,
    search: search,
    read: read,
    create: create,
    write: write,
    unlink: unlink
}
module.exports = OpenERP;
module.exports.testConnection = getDbList;
module.exports.getDbList = getDbList