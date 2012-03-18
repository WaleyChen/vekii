// VARS
// setup validate token and playlists JSON links
var hash_values_str = jQuery.param.fragment(); // get the current URL's hash values
var hash_values_json = jQuery.deparam(hash_values_str); // convert hash values into JSON object
var hash_values_json_str = JSON.stringify(hash_values_json); // convert JSON object into string 
var validate_token_link = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + hash_values_json.access_token;
var playlists_JSON_link = "https://gdata.youtube.com/feeds/api/users/default/playlists?v=2&alt=json&access_token=" + hash_values_json.access_token;

var library = new Object(); // object containing the user's playlists and the songs of each playlist
var playlists_Names = new Array();
var playlists = new Array();
var playlist_And_Songs;
var playlists_JSON;
var max_playlist_size = 50; 
var start_index; // The start-index parameter specifies the index of the first matching result that should be included in the result set. This parameter uses a one-based index, meaning the first result is 1, the second result is 2 and so forth. This parameter works in conjunction with the max-results parameter to determine which results to return. For example, to request the second set of 10 results – i.e. results 11-20 – set the start-index parameter to 11 and the max-results parameter to 10.
var youtube_link = "https://www.youtube.com/v/7GQieH-SFdI?version=3&autohide=1&showinfo=0";

function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("myytplayer");
	$("#output").append("onYoutubePlayerReadyRequest Called");
}

// AJAX REQUESTS
// XMLHttpRequest cannot load https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=ya29.AHES6ZRUyKNtc8orqv5tCQCTm9lUTZAM8HZB9S6_ER-89StgdQaOX3k. Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin.
// the following ajax request validates the token and tries to reload to their site but fails which isn't a big deal since we only
// want to valdiate the token anyways
// ajax request to validate access token received
$.ajax({
  	url:           validate_token_link,
  	dataType:      'json',

    beforeSend:    function(jqXHR) {
		           		jqXHR.specialMessage = "HELLOMOTO";
				   }, 
				
  	success:       function(data, textStatus, jqXHR) {
						$("#output").append("<li>" + jqXHR.specialMessage + "</li>");
		   	       },
		
  	error:         function(jqXHR, textStatus, errorThrown) {
				   		$("#output").append("<li>" + jqXHR.specialMessage + "</li>");
  		   	       }
});

$.getJSON(playlists_JSON_link, function(json) {
	playlists_JSON = json;
	feed = json.feed;
	$("#output").append("request playlist AJAX request succeeded");
	$("#output").append("<li>" + json.feed.title.$t + "</li>");
	$("#output").append("<li>" + json.feed.author[0].name.$t + "</li>");
	
	for (i = 0; i < json.feed.entry.length; i++) {
		$("#playlists").append("<li>" + json.feed.entry[i].title.$t + "</li>");
		$("#output").append("<li>" + json.feed.entry[i].title.$t + "</li>");
		playlist_size = json.feed.entry[i].yt$countHint.$t;

		var songs;
		var playlist_Title_And_Songs;
		
		for (i5 = 0; i5 < Math.ceil(playlist_size/max_playlist_size); i5 ++) {
			start_index = 1 + (i5 * 50);
			$("#output").append("</br>" + start_index + "</br>");
			playlist_link = json.feed.entry[i].content.src + "&alt=json&max-results=50&start-index=" + start_index;
			$("#output").append(playlist_link);
			
			$.ajax({
			  	url:          playlist_link,
			  	dataType:     'json',
			
			    beforeSend:   function(jqXHR) {
								jqXHR.specialMessage = "HELLOMOTO";
							  }, 
							
			  	success:      function(data, textStatus, jqXHR) {
								
					   	      },
					
			  	error:        function(jqXHR, textStatus, errorThrown) {
								$("#output").append("<li>" + jqXHR.specialMessage + "</li>");
			  		   	      }
			});
			
			
			$.getJSON(playlist_link, function(inner_json, textStatus, jqXHR) {
				$("#output").append(playlist_link);
				$("#output").append(textStatus);
				$("#output").append(jqXHR);
				
				// if (start_index == 1) {
					songs = new Array();
					playlist_Title_And_Songs = new Object();
			//	} else {
					// reuse previous songs and playlist_Title_And_Songs vars
				//}

				for (i2 = 0; i2 < inner_json.feed.entry.length; i2++) {
					var song = new Object();
					video_id_regexp = /[=][^&]+(?=&)/;

					// the video id should be in the link array else throw an exception
					for (i3 = 0; i3 < inner_json.feed.entry[i2].link.length; i3++) {
						if (inner_json.feed.entry[i2].link[i3].type == "text/html") {
							video_id = inner_json.feed.entry[i2].link[i3].href.match(video_id_regexp)[0].substr(1);
							break;
						} else if (i3 == inner_json.feed.entry[i2].link.length - 1) {
							$("#output").append("<li>" + "ERROR:" + inner_json.feed.entry[i2].title.$t + "</li>");
							throw "Could not find video id";
						}
					}

					song.title = inner_json.feed.entry[i2].title.$t;
					song.video_id = video_id;
					songs.push(song);	

					// if last song in playlist, add the playlist to playlists array
					if (i2 == inner_json.feed.entry.length - 1) {
						$("#output").append("<li>" + "ERROR:" + inner_json.feed.entry.length + "</li>");
						playlist_Title_And_Songs.title = inner_json.feed.title.$t;
						playlist_Title_And_Songs.songs = songs;
						playlists.push(playlist_Title_And_Songs)
					}

					$("#output").append("<li>" + inner_json.feed.title.$t +  ": "+ inner_json.feed.entry[i2].title.$t + " " + video_id +"</li>");
					// $("#playlists").append("<li>" + inner_json.feed.title.$t +  ": "+ inner_json.feed.entry[i2].title.$t + " " + video_id +"</li>");
				}
			});
		}
	}
	
	playlists.sort();
});

document.write (hash_values_json_str);
// to-do
// If the user refused to grant access to your application, Google will have included the access_denied error message in the
// hash fragment of the redirect_uri: http://localhost/oauth2callback#error=access_denied
document.write("</br>");

// validate the token returned
document.write(validate_token_link);

document.write ("</br>");
document.write (document.location.href); 
document.write ("</br>");
document.write (document.location.hash); 

// link for testing environment
var googleLoginLink    = "https://accounts.google.com/o/oauth2/auth?";
var client_id          = "client_id=908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com";
var redirect_uri       = "redirect_uri=http://localhost:3000/oauth2callback";
var gscope             = "scope=https://gdata.youtube.com";
var response_type      = "response_type=token";
var googleLoginLink    = googleLoginLink + client_id + '&' + redirect_uri + '&' + gscope + '&' + response_type;

// to-do
// link for production environment

(function ($) {
	$.ajaxSetup ({
		cache: false
	});

	Friend               = Backbone.Model.extend({
		//Create a model to hold friend atribute
		name: null
	});

	Friends              = Backbone.Collection.extend({
		//This is our Friends collection and holds our Friend models
		initialize: function (models, options) {
			this.bind("add", options.view.addFriendLi);
			//Listen for new additions to the collection and call a view function if so
		}
	});

	AppView              = Backbone.View.extend({
		el: $("body"),
		initialize: function () {
			this.friends     = new Friends( null, { view: this });
			//Create a friends collection when the view is initialized.
			//Pass it a reference to this view to create a connection between the two
		},
		events: {
			"click #add-friend":  "showPrompt",
			"click #validate-token":  "validateToken",
		},
		showPrompt: function () {
			var friend_name  = prompt("Who is your friend?");
			var friend_model = new Friend({ name: friend_name });
			//Add a new friend model to our friend collection
			this.friends.add( friend_model );
		},
		validateToken: function() {
			$("#validate-token-link").append("<li>" + "getAccessToken called" + "</li>");
			$("#friends-list").append("<li>" + "getAccessToken called" + "</li>");
			jQuery.ajax(googleLoginLink);
			$.ajax({ type: "GET", url: validate_token_link, dataType: "jsonp", success: readData(data) });
		},
		addFriendLi: function (model) {
			//The parameter passed is a reference to the model that was added
			$("#friends-list").append("<li>" + model.get('name') + "</li>");
			//Use .get to receive attributes of the model
		}
	});

	var appview = new AppView;
	})(jQuery);