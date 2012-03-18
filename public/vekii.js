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
var max_playlist_size = 50; 
var start_index; // The start-index parameter specifies the index of the first matching result that should be included in the result set. This parameter uses a one-based index, meaning the first result is 1, the second result is 2 and so forth. This parameter works in conjunction with the max-results parameter to determine which results to return. For example, to request the second set of 10 results – i.e. results 11-20 – set the start-index parameter to 11 and the max-results parameter to 10.
var youtube_link = "https://www.youtube.com/v/7GQieH-SFdI?version=3&autohide=1&showinfo=0";

var youtube_username;

function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("myytplayer");
	$("#output").append("onYoutubePlayerReadyRequest Called POKEMON");
}

// AJAX REQUESTS
// XMLHttpRequest cannot load https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=ya29.AHES6ZRUyKNtc8orqv5tCQCTm9lUTZAM8HZB9S6_ER-89StgdQaOX3k. Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin.
// we get the error above because
// the following ajax request validates the token and tries to reload to their site but fails which isn't a big deal since we only
// want to valdiate the token anyways
// ajax request to validate access token received
$.ajax({
  	url:           validate_token_link,
  	dataType:      'json',

    beforeSend:    function(jqXHR) {
				   }, 
				
  	success:       function(data, textStatus, jqXHR) {
		   	       },
		
  	error:         function(jqXHR, textStatus, errorThrown) {
  		   	       }
});

// gets the user's playlists and stores them into a JS object
$.getJSON(playlists_JSON_link, function(json) {
	youtube_username = json.feed.author[0].name.$t;
	
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

