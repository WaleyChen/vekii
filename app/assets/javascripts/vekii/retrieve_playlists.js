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
var related_video;
var related_videos;
var related_videos_requests_sent_size = 0;
var related_videos_requests_received_size = 0;
var song;
var song_title_as_param;
var songs;
var songs_related_videos_hash = {};

// misc vars
var count = 0;

// AJAX vars
var dev_Key = "AI39si5Cwgvp6TJAY4pqrUcK8dCcL8WntrOGNmmn6MBvBpN40Ru_pKF99Y0m-y_WJvLxtblt4REVaTqlQYsmr5Q05E1Bwvkmyw";
// this var is for the youtube AJAX playlists call
// The start-index parameter specifies the index of the first matching result that should be included in the result set. 
// This parameter uses a one-based index, meaning the first result is 1, the second result is 2 and so forth. This parameter 
// works in conjunction with the max-results parameter to determine which results to return. For example, to request the second 
// set of 10 results – i.e. results 11-20 – set the start-index parameter to 11 and the max-results parameter to 10.
var playlists_JSON_link = "https://gdata.youtube.com/feeds/api/users/default/playlists?v=2&alt=json&access_token=" 
						  + hash_values_json.access_token;
var song_related_videos_JSON_link;
var start_index; 

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
			playlist_link = json.feed.entry[playlists_index].content.src 
							+ "&alt=json&max-results=50&start-index=" 
							+ start_index 
							+ "&access_token=" 
							+ hash_values_json.access_token
							+ "&key="
							+ dev_Key;
			
			$.ajax({
				type: 		  'GET',
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

								for (song_index = 0; song_index < json.feed.entry.length; song_index++) {
									new_playlist = 1;
									song = new Object();
									video_id_regexp = /[=][^&]+(?=&)/;

									// the video id should be in the link array else throw an exception
									for (link_index = 0; link_index < json.feed.entry[song_index].link.length; link_index++) {
										if (count == 2) {
											break;
										} else if (json.feed.entry[song_index].link[link_index].rel == "alternate") {
											video_id = json.feed.entry[song_index].link[link_index].href.match(video_id_regexp)[0].substr(1);
											count++;
										} else if (json.feed.entry[song_index].link[link_index].rel.lastIndexOf("video.related") != -1) {
											song_related_videos_JSON_link = json.feed.entry[song_index].link[link_index].href;
											count++;
										} else if (link_index == json.feed.entry[song_index].link.length - 1) {
											throw "Could not find video id or related videos feed.";
										}
									}
									count = 0;
									
									song_related_videos_JSON_link =  song_related_videos_JSON_link 
																	 + "&alt=json" 
																	 + "&access_token=" 
																	 + hash_values_json.access_token
																	 + "&key="
																	 + dev_Key;
									
									// get the related videos JSON feed
									$.ajax({
										type:  			'GET',
									  	url:            song_related_videos_JSON_link,
									  	dataType:      'json',

									    beforeSend:    function(jqXHR) {
															related_videos_requests_sent_size++;
															jqXHR.playlist_id = playlist_id;
															jqXHR.song_video_id = video_id;
													   }, 

									  	success:       function(json, textStatus, jqXHR) {
															related_videos = new Array();
															related_videos_requests_received_size++;
															
															for (entry_index = 0; entry_index < json.feed.entry.length; entry_index++) {
																related_video = new Object();
																related_video.title = json.feed.entry[entry_index].title.$t;
																
																// the video id should be in the link array else throw an exception
																for (link_index = 0; link_index < json.feed.entry[entry_index].link.length; link_index++) {
																	if (json.feed.entry[entry_index].link[link_index].rel == "alternate") {
																		related_video.video_id = json.feed.entry[entry_index].link[link_index].href.match(video_id_regexp)[0].substr(1);
																		break;
																	} else if (link_index == json.feed.entry[entry_index].link.length - 1) {
																		throw "Could not find video id or related videos feed.";
																	}
																}
																
																related_videos.push(related_video);
															}
															
															songs_related_videos_hash[jqXHR.song_video_id] = related_videos;
															
															// last AJAX request received
															if (related_videos_requests_sent_size == related_videos_requests_received_size) {
																// assign related videos to each song
																jQuery.each(playlists.playlists, function(playlist_index, playlists_copy) {
																	jQuery.each(playlists_copy.songs, function(song_index, song_copy) {
																		playlists.playlists[playlist_index].songs[song_index].related_videos = 
																			songs_related_videos_hash[playlists.playlists[playlist_index].songs[song_index].video_id];
																	});
																});
																
																playlists.playlists.sort(playlists_Sort_Func);

																show_Playlists();
																playlists_JSON = JSON.stringify(playlists);

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

									  	error:         function(jqXHR, textStatus, errorThrown) {
															throw 'AJAX call for related videos JSON feed failed.';
									  		   	       }
									});
									
									song.title = json.feed.entry[song_index].title.$t; 
									song.video_id = video_id;
									songs.push(song);	

									// if added last song in playlist, add the playlist to playlists array
									if (song_index == json.feed.entry.length - 1) {	
										jQuery.each(playlists.playlists, function(index, value) {
											if (value.title == json.feed.title.$t) { 
												new_playlist = 0;
												old_playlist_index = index;
												return false; 
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
								}
									
								// if this is the last ajax request returning
								if (playlist_ajax_requests_sent_size == playlist_ajax_requests_received_size) {
									/*
									playlists.playlists.sort(playlists_Sort_Func);
									
									show_Playlists();
									show_Recommended();
									playlists_JSON = JSON.stringify(playlists);
									
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
									*/
								}
					   	      },
					
			  	error:        function(jqXHR, textStatus, errorThrown) {
								$("#output").append("<li>" + jqXHR.specialMessage + "</li>");
			  		   	      }
			});
		}
	}
});