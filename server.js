#!/bin/env node
require('./termination_handlers.js');

var express = require('express');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// Create and configure server

var app = express();

app.get('/info', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.send("simple app to test orange api");
});

app.get('/', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.send("empty root");
});

app.get('/login', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.send("empty login");
});

// Start server

app.listen(port, ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
        Date(Date.now() ), ipaddress, port);
});
