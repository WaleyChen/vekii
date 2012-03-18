// VARS
// setup validate token and playlists JSON links
var hash_values_str = jQuery.param.fragment(); // get the current URL's hash values
var hash_values_json = jQuery.deparam(hash_values_str); // convert hash values into JSON object
var hash_values_json_str = JSON.stringify(hash_values_json); // convert JSON object into string 
var validate_token_link = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + hash_values_json.access_token;
var playlists_JSON_link = "https://gdata.youtube.com/feeds/api/users/default/playlists?v=2&alt=json&access_token=" + hash_values_json.access_token;

var library = new Object(); // object containing the user's playlists and the songs of each playlist

// playlists' vars
var playlists_Names = new Array();
var playlists = new Array();
var playlists_size = 0;

var playlist_And_Songs;
var max_playlist_size = 50; 

var start_index; // The start-index parameter specifies the index of the first matching result that should be included in the result set. This parameter uses a one-based index, meaning the first result is 1, the second result is 2 and so forth. This parameter works in conjunction with the max-results parameter to determine which results to return. For example, to request the second set of 10 results – i.e. results 11-20 – set the start-index parameter to 11 and the max-results parameter to 10.
var youtube_link = "https://www.youtube.com/v/7GQieH-SFdI?version=3&autohide=1&showinfo=0";

var youtube_username;
var playlist_id = 0;

var new_playlist = 1;
var old_playlist_index;

var playlist_ajax_requests_sent_size = 0;
var playlist_ajax_requests_received_size = 0;

function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("myytplayer");
	$("#output").append("onYoutubePlayerReadyRequest Called");
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
	playlists_size = json.feed.openSearch$totalResults.$t;
	
	for (playlists_index = 0; playlists_index < json.feed.entry.length; playlists_index++) {
		playlist_size = json.feed.entry[playlists_index].yt$countHint.$t;

		var songs;
		var playlist_Title_And_Songs;

		for (requestNo = 0; requestNo < Math.ceil(playlist_size/max_playlist_size); requestNo++) {
			// don't request the playlist if the playlist is private since Youtube API doesn't provide private playlist access
			if (json.feed.entry[playlists_index].yt$private) {
				playlists_size--;
				break;
			}
			
			playlist_ajax_requests_sent_size++;
			
			start_index = 1 + (requestNo * 50);
			playlist_link = json.feed.entry[playlists_index].content.src + "&alt=json&max-results=50&start-index=" + start_index;
			
			$.ajax({
			  	url:          playlist_link,
			  	dataType:     'json',
			
			    beforeSend:   function(jqXHR) {
								playlist_id++;
								jqXHR.playlist_id = playlist_id;
							  }, 
							
			  	success:      function(json, textStatus, jqXHR) {
								playlist_ajax_requests_received_size++;
								
								songs = new Array();
								playlist_Title_And_Songs = new Object();

								for (i2 = 0; i2 < json.feed.entry.length; i2++) {
									new_playlist = 1;
									var song = new Object();
									video_id_regexp = /[=][^&]+(?=&)/;

									// the video id should be in the link array else throw an exception
									for (i3 = 0; i3 < json.feed.entry[i2].link.length; i3++) {
										if (json.feed.entry[i2].link[i3].type == "text/html") {
											video_id = json.feed.entry[i2].link[i3].href.match(video_id_regexp)[0].substr(1);
											break;
										} else if (i3 == json.feed.entry[i2].link.length - 1) {
											$("#output").append("<li>" + "ERROR:" + json.feed.entry[i2].title.$t + "</li>");
											throw "Could not find video id";
										}
									}

									song.title = json.feed.entry[i2].title.$t;
									song.video_id = video_id;
									songs.push(song);	

									// if added last song in playlist, add the playlist to playlists array
									if (i2 == json.feed.entry.length - 1) {	
										jQuery.each(playlists, function(index, value) {
											if (value.title == json.feed.title.$t) { 
												new_playlist = 0;
												old_playlist_index = index;
												return false; // the equivalent of break
											}
										});
										
										if (new_playlist) {
											playlist_Title_And_Songs.title = json.feed.title.$t;
											playlist_Title_And_Songs.songs = songs;
											playlists.push(playlist_Title_And_Songs)
										} else {
										 	playlists[old_playlist_index].songs = playlists[old_playlist_index].songs.concat(songs)
										}
									}
									// $("#output").append("plsize: " + playlists_size + "</br>");
									// $("#output").append("plsize: " + playlist_ajax_requests_size + "</br>");
									// $("#output").append(jqXHR.playlist_id + " "+ json.feed.title.$t +  ": "+ json.feed.entry[i2].title.$t + " " + video_id + "</br>");
								}
									// if this is the last ajax request returning
									if (playlist_ajax_requests_sent_size == playlist_ajax_requests_received_size) {
										playlists.sort(playlist_Sort_Func);
										
										jQuery.each(playlists, function(index, value) {
										$("#playlists").append(value.title + "</br>");

											// jQuery.each(value.songs, function(index, value) {
											// 	$("#output").append(value.title + "</br>");
											// });
										});
									}
					   	      },
					
			  	error:        function(jqXHR, textStatus, errorThrown) {
								$("#output").append("<li>" + jqXHR.specialMessage + "</li>");
			  		   	      }
			});
		}
	}
});

// MISC
function playlist_Sort_Func(a, b) {
	var x = a.title.toLowerCase();
	var y = b.title.toLowerCase();
	
	if (y > x) {
		return -1;
	} else if (x > y) {
		return 1;
	} else {
		return 0;
	}
}

/**
jQuery.each(playlists, function(index, value) {
	$("#output").append(value.title + "</br>");
	
	jQuery.each(value.songs, function(index, value) {
		$("#output").append(value.title + "</br>");
	});
});
**/

// MISC 

// you can only sort after the playlists object has been completed but not while it's still making AJAX calls
/**
// from http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256C8D00514FA4
function playlist_Sort_Func(a, b) {
	var x = a.title.toLowerCase();
	var y = b.title.toLowerCase();
	
	if (y > x) {
		return -1;
	} else if (x > y) {
		return 1;
	} else {
		return 0;
	}
}

function sortByFirstName(a, b) {
    var x = a.title.toLowerCase();
    var y = b.title.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

playlists.sort(sortByFirstName);
**/
