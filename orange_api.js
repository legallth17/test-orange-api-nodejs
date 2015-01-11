exports.authorize_url = function(client_id, redirect_uri) {

	return "https://api.orange.com/oauth/v2/authorize?scope=openid&response_type=code&client_id="+client_id+
	       "&state=TEST"+
	       "&redirect_uri="+encodeURIComponent(redirect_uri);

}