var hash_values_str = jQuery.param.fragment(); // get the current URL's hash values
var hash_values_json = jQuery.deparam(hash_values_str); // convert hash values into JSON object
var hash_values_json_str = JSON.stringify(hash_values_json); // convert JSON object into string 
var access_token;

var request_access_token_link = 'https://accounts.google.com/o/oauth2/auth?'
var client_id = '908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com'
var gscope = 'https://gdata.youtube.com'
var response_type = 'token'
var redirect_uri = 'http://localhost:3000'
request_access_token_link = request_access_token_link 
							+ 'client_id=' + client_id 
							+ '&redirect_uri=' + redirect_uri 
							+ '&scope=' + gscope 
							+ '&response_type=' + response_type;

if (hash_values_json.access_token != undefined) {
	logged_in = 1;
	access_token = hash_values_json.access_token;
} else if (getCookie('Vekii_Access_Token') != undefined && getCookie('Vekii_Access_Token') != 'undefined') {
	logged_in = 1;
	access_token = getCookie('Vekii_Access_Token');
} else { 
	// apprise('No access token.');
}

// validate access token
if (username != undefined && username != 'undefined' || access_token != undefined && access_token != 'undefined') { 
	$.ajax({
	    type: 'GET',
	    url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + access_token,
		dataType: 'jsonp',
	    success: function(json) {
					if (json.error != 'invalid_token') {
						if (json.audience != client_id) {
							alert(json.audience);
							apprise('Invalid token.');
							// get_Access_Token();						
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
} 

function get_Access_Token() {
	window.location = request_access_token_link;
}