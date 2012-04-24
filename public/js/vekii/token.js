var google_login_link = "https://accounts.google.com/o/oauth2/auth?"
var client_id = "client_id=908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com"
var gscope = "scope=https://gdata.youtube.com"
var response_type = "response_type=token"
var redirect_uri = "redirect_uri=http://localhost:3000"
google_login_link = google_login_link + client_id + '&' + redirect_uri + '&' + gscope + '&' + response_type;

if (username != undefined && username != 'undefined') { 
	$.ajax({
	    type: 'GET',
	    url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + access_token,
		dataType: 'jsonp',
	    success: function(json) {
					// valid token
					alert(json.error);
					if (json.error != 'invalid_token') {
						if (json.audience != client_id) {
							apprise('Invalid token.');						
						}
					// invalid token, get new token
					} else {
						get_Access_Token();
					}
				 },
		error: function(jqXHR, textStatus, errorThrown) {	 
		       }
	});
}

// store new access token into cookie
if (access_token != undefined) {
	setCookie('Vekii_Access_Token', access_token);
// else, get access token from cookie
} else if (getCookie('Vekii_Access_Token') != undefined) {
	access_token = getCookie('Vekii_Access_Token');
} else { 
	apprise('No access token.');
}

function get_Access_Token() {
	window.location = google_login_link;
}