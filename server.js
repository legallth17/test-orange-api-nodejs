#!/bin/env node
require('./termination_handlers.js');

var express = require('express');
var orange_api = require('./orange_api.js');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var orange_api_client_id = process.env.ORANGE_API_CLIENT_ID || 'UNDEFINED';

console.log("Client ID:"+orange_api_client_id);

// Create and configure server

var app = express();

app.get('/info', function(req, res) {
		res.type('text/plain');
        res.send('simple app to test orange api\n'+
        	      'orange_api_client_id:'+ orange_api_client_id);
});

app.get('/', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.send("empty root");
});

app.get('/login', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.send("empty login");
});

app.get('/authenticate', function(req, res) {
	res.redirect(orange_api.authorize_url());
});
// Start server

app.listen(port, ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
        Date(Date.now() ), ipaddress, port);
});
