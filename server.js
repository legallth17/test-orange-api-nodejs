#!/bin/env node
require('./termination_handlers.js');

var express = require('express');
var jwt     = require('jsonwebtoken');
var orange_api = require('./orange_api.js');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var orange_api_client_id     = process.env.ORANGE_API_CLIENT_ID || 'UNDEFINED';
var orange_api_client_secret = process.env.ORANGE_API_CLIENT_SECRET || 'UNDEFINED';
var orange_api_redirect_url  = 'http://app1-legallth.rhcloud.com/authorization'


console.log("Client ID:"+orange_api_client_id);

// Create and configure server

var app = express();

app.use(express.cookieParser());
app.use(express.session({secret: 'HJ786FSRZYTV675432KLPB'}))

app.use('/authorized', function(req,res,next) {
    if(req.session.token) {
        console.log("token exists: "+JSON.stringify(req.session.token));
        next();
    } else {
        console.log("no token: user is not authenticated nor authorized");
        res.redirect('authenticate');
    }
});

app.get('/info', function(req, res) {
		res.type('text/plain');
        res.send('simple app to test orange api\n'+
        	      'orange_api_client_id:'+ orange_api_client_id);
});

app.get('/', function(req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.send("use /authenticate to test");
});

app.get('/authorization', function(req, res) {
        if(req.query.error) {
            res.send(req.query);
            return;
        }
        if( !req.query.code) {
            res.send("authorization code not provided");
            return;
        }
        if( !orange_api.is_valid_state_code(req.query.state)) {
            res.send("invalid state code: "+req.query.state);
            return;
        }
        var authorization_code = req.query.code;
        console.log("authorization code: "+authorization_code);
        orange_api.token(orange_api_client_id, orange_api_client_secret, authorization_code, orange_api_redirect_url, 
            function(token) {
                if(!token) {
                    res.send("error while getting token");
                    return;
                }
                console.log("token: "+JSON.stringify(token));
                var id_token = jwt.decode(token.id_token);
                console.log("id_token: "+JSON.stringify(id_token));
                req.session.token=token;
                res.redirect('authorized');
            });
});

app.get('/authenticate', function(req, res) {
	res.redirect(orange_api.authorize_url(orange_api_client_id, orange_api_redirect_url));
});

app.get('/authorized', function(req, res) {
    res.send('user has been authorized');
});

app.get('/authorized/info', function(req, res) {
    res.send('authorized section');
});

// Start server

app.listen(port, ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
        Date(Date.now() ), ipaddress, port);
});
