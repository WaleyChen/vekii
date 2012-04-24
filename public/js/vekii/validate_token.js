// VARS
var hash_values_str = jQuery.param.fragment(); // get the current URL's hash values
var resync;
if (jQuery.param.querystring() == "resync=true") {
	resync = true;
} else {
	resync = false;
}
var hash_values_json = jQuery.deparam(hash_values_str); // convert hash values into JSON object
var hash_values_json_str = JSON.stringify(hash_values_json); // convert JSON object into string 
var validate_token_link = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + hash_values_json.access_token + "&alt=JSON" + "&callback=?";
var access_token = hash_values_json.access_token;
var client_id = '908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com';
var client_secret = 'VhkK45V3YKXIsjgmmADnGhwn';
var refresh_token = hash_values_json.refresh_token;	

if (refresh_token != undefined) {
	setCookie('Vekii_Refresh_Token', refresh_token);
} else if (getCookie('Vekii_Refresh_Token') != undefined) {
	refresh_token = getCookie('Vekii_Refresh_Token');
} else {
	// apprise('No refresh token.');
}

$('#console').append(access_token);

