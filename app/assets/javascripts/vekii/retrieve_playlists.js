// playlists' vars
var playlists = new Object();
var playlists_JSON;
var playlists_size = 0;
var username;

// playlist vars
var max_playlist_size = 50; 
var new_playlist = 1;
var old_playlist_index;
var playlist;
var playlist_id = 0;
var playlist_ajax_requests_sent_size = 0;
var playlist_ajax_requests_received_size = 0;
var song;
var songs;

// AJAX vars
// this var is for the youtube AJAX playlists call
// The start-index parameter specifies the index of the first matching result that should be included in the result set. 
// This parameter uses a one-based index, meaning the first result is 1, the second result is 2 and so forth. This parameter 
// works in conjunction with the max-results parameter to determine which results to return. For example, to request the second 
// set of 10 results – i.e. results 11-20 – set the start-index parameter to 11 and the max-results parameter to 10.
var start_index; 
var playlists_JSON_link = "https://gdata.youtube.com/feeds/api/users/default/playlists?v=2&alt=json&access_token=" + hash_values_json.access_token;

// don't get user's playlists from Youtube API if we've retrived it before
// instead, retrive from our database

// gets the user's playlists from Youtube API and stores them into a JS object
$.getJSON(playlists_JSON_link, function(json) {
	username = json.feed.author[0].name.$t;
	playlists_size = json.feed.openSearch$totalResults.$t;
	
	playlists.username = username;
	playlists.playlists = new Array();
	
	for (playlists_index = 0; playlists_index < json.feed.entry.length; playlists_index++) {
		playlist_size = json.feed.entry[playlists_index].yt$countHint.$t;

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
								playlist = new Object();

								for (i2 = 0; i2 < json.feed.entry.length; i2++) {
									new_playlist = 1;
									song = new Object();
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
										jQuery.each(playlists.playlists, function(index, value) {
											if (value.title == json.feed.title.$t) { 
												new_playlist = 0;
												old_playlist_index = index;
												return false; // the equivalent of break
											}
										});
										
										if (new_playlist) {
											playlist.title = json.feed.title.$t;
											playlist.songs = songs;
											playlists.playlists.push(playlist)
										} else {
										 	playlists.playlists[old_playlist_index].songs = playlists.playlists[old_playlist_index].songs.concat(songs)
										}
									}
									// $("#output").append("plsize: " + playlists_size + "</br>");
									// $("#output").append("plsize: " + playlist_ajax_requests_size + "</br>");
									// $("#output").append(jqXHR.playlist_id + " "+ json.feed.title.$t +  ": "+ json.feed.entry[i2].title.$t + " " + video_id + "</br>");
								}
									// if this is the last ajax request returning
								if (playlist_ajax_requests_sent_size == playlist_ajax_requests_received_size) {
									playlists.playlists.sort(playlists_Sort_Func);
									
									jQuery.each(playlists.playlists, function(index, playlist) {
										$("#playlists").append("<a href=\"javascript:show_playlist('" 
															   + playlist.title 
															   + "')\">"
															   + playlist.title 
															   + "</a> </br>");

										playlist.songs.sort(playlists_Sort_Func);										
										playlists_JSON = JSON.stringify(playlists);
									});
									
									// save playlists to our backend
									$.ajax({
									        type: 			"POST",
									        url: 			"/playlists",
											contentType: 	"application/json",
									        data: 			playlists_JSON,
											processdata: 	false,
											beforeSend: 	function(jqXHR) {
																jqXHR.setRequestHeader('X-CSRF-Token', 
																	$('meta[name="csrf-token"]').attr('content'))
															},
									        success: 		function(response) {
									        					if (response == "POST was successful.") {
																} else if (response == "Already exists in the database."){
																}
									        				}
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
function playlists_Sort_Func(a, b) {
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

function show_playlist(playlist_title) {
	$("#playlist").html('');
	$("#playlist").append(playlist_title + '</br>');
	
	jQuery.each(playlists.playlists, function(index, playlist) {
		if (playlist.title == playlist_title) { 
			jQuery.each(playlist.songs, function(index, song) {
				$("#playlist").append("<a href=\"javascript:ytplayer.loadVideoById('" 
									  	+ song.video_id 
									  	+ "')\">" 
										+ song.title 
										+ " "
										+ "</a>" 
										+ "<img src=\"/assets/delete.png\" alt=\"delete.png\" height=\"8\" width=\"8\" " 
										+ "/>"  
										+ "</br>");
				});
		}
	});
}