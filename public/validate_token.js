// VARS
var hash_values_str = jQuery.param.fragment(); // get the current URL's hash values
var hash_values_json = jQuery.deparam(hash_values_str); // convert hash values into JSON object
var hash_values_json_str = JSON.stringify(hash_values_json); // convert JSON object into string 
var validate_token_link = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + hash_values_json.access_token + "&alt=JSON" + "&callback=?";

// AJAX REQUESTS
// XMLHttpRequest cannot load https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=ya29.AHES6ZRUyKNtc8orqv5tCQCTm9lUTZAM8HZB9S6_ER-89StgdQaOX3k. Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin.
// we get the error above because
// the following ajax request validates the token and tries to reload to their site but fails which isn't a big deal since we only
// want to valdiate the token anyways
// ajax request to validate access token received
if (0) {
	$.ajax({
		type: 		   'GET',
	  	url:           validate_token_link,
	  	dataType:      'jsonp',

	    beforeSend:    function(jqXHR) {
							jqXHR.setRequestHeader('Access-Control-Allow-Origin', '*');
					   }, 
				
	  	success:       function(data, textStatus, jqXHR) {
							loading_indicator = 
								getBusyOverlay("viewport",
											   {color:'black', 
													opacity:0.5, 
													text:'Retrieving data', 
													style:'text-decoration:blink;font-weight:bold;font-size:12px;color:white'},
											   {color:'#fff', 
													size:32, 
													type:'t'});
			   	       },
		
	  	error:         function(jqXHR, textStatus, errorThrown) {
	  		   	       }
	});
}