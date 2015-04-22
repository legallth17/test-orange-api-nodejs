var request = require('request');
var uuid = require('node-uuid');

var state_codes = [];

var new_state_code = function() {
    var code = uuid.v1();
    state_codes.push(code);
    return code;
}

exports.authorize_url = function(client_id, redirect_uri) {
	return "https://api.orange.com/oauth/v2/authorize?scope=openid&response_type=code&client_id="+client_id+
	       "&state="+new_state_code()+
	       "&redirect_uri="+encodeURIComponent(redirect_uri);
}

exports.is_valid_state_code = function(code) {
    var i=0;
    for(i=0;i<state_codes.length;i++) {
        if( state_codes[i] == code) return true;
    }
    return false;
}

exports.token = function(client_id, client_secret, authorization_code, redirect_uri, callback) {
    request.post(
        'https://api.orange.com/oauth/v2/token',
        {   auth: { user: client_id, pass: client_secret }, 
            form: { grant_type: "authorization_code", code: authorization_code, redirect_uri: redirect_uri } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var token = JSON.parse(body);
                console.log(token.id_token);
                callback(token);
            } else {
                callback(undefined);
            }
        }
    );
}
