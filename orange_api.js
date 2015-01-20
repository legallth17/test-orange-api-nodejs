var request = require('request');

exports.authorize_url = function(client_id, redirect_uri) {
	return "https://api.orange.com/oauth/v2/authorize?scope=openid&response_type=code&client_id="+client_id+
	       "&state=TEST"+
	       "&redirect_uri="+encodeURIComponent(redirect_uri);
}

exports.state = function() {
	return "TEST";
}

exports.token = function(client_id, client_secret, authorization_code, redirect_uri, callback) {
    request.post(
        'https://api.orange.com/oauth/v2/token',
        {   auth: { user: client_id, pass: client_secret }, 
            form: { grant_type: "authorization_code1", code: authorization_code, redirect_uri: redirect_uri } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                callback(body);
            } else {
                callback(undefined);
            }
        }
    );
}
