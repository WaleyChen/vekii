// AJAX vars
var dev_Key = "AI39si5Cwgvp6TJAY4pqrUcK8dCcL8WntrOGNmmn6MBvBpN40Ru_pKF99Y0m-y_WJvLxtblt4REVaTqlQYsmr5Q05E1Bwvkmyw";
var playlists_JSON_link = "https://gdata.youtube.com/feeds/api/users/default/playlists?v=2"
						  	+ "&access_token=" 
						  		+ hash_values_json.access_token
							+ "&alt="
								+ "json"
						  	+ "&max-results="
								+ "50"
						  	+ "&key="
						  		+ dev_Key;
var song_related_videos_JSON_link;
var start_index;

// playlists' vars
var max_playlists_size = 50;
var playlists = new Object();
var playlists_JSON;
var playlists_size;
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

// session vars
var first_time_logging_in = 1;

// youtube player vars
var atts =   { id: "myytplayer" };
var params = { allowScriptAccess: "always",
			   wmode: 			  "transparent" };

// misc vars
var count = 0;
var loading_indicator;

if (hash_values_json.access_token == undefined /* not logged in */ ) {
	username = getCookie('Vekii');
	
	// if user has logged in before, grab their playlists from the db
	if (username != undefined & username != "undefined") {	
		show_Settings_DDM();
		
		$.ajax({
		        type: 			"GET",
		        url: 			"/playlists/" 
									+ username 
									+ ".json",
				dataType:      'json',
				
		        success: 		function(json) {
									playlists.playlists = json;
									// swfobject.embedSWF will load the player from YouTube and embed it onto your page.
								    swfobject.embedSWF("http://www.youtube.com/v/u1zgFlCw8Aw?enablejsapi=1&playerapiid=ytplayer&version=3",
								                       "yt_api_player", "640", "390", "8", null, null, params, atts);

									show_Playlists();
									
									var playlists_list = "";

									jQuery.each(playlists.playlists, function(index, playlist) {
										playlists_list = playlists_list + "<li><a href=\"#\">" + playlist.title + "</a></li>";
									}); 
									
									show_Add_To_Playlist_DDM(playlists_list);
		        				},

				error: 			function(jqXHR, textStatus, errorThrown) {
									$("#console").append("getting sample playlists failed </br>"); 
						        }
		});
	// else get sample playlists from our backend
	} else {
		show_Login_Button();
				
		$.ajax({
		        type: 			"GET",
		        url: 			"/playlists/" 
									+ "nikeelevet"
									+ ".json",
				dataType:      'json',
				
		        success: 		function(json) {
									playlists.playlists = json;
									// swfobject.embedSWF will load the player from YouTube and embed it onto your page.
								    swfobject.embedSWF("http://www.youtube.com/v/u1zgFlCw8Aw?enablejsapi=1&playerapiid=ytplayer&version=3",
								                       "yt_api_player", "640", "390", "8", null, null, params, atts);

									show_Playlists();
									
									var playlists_list = "";

									jQuery.each(playlists.playlists, function(index, playlist) {
										playlists_list = playlists_list + "<li><a href=\"#\">" + playlist.title + "</a></li>";
									}); 
									
									show_Add_To_Playlist_DDM(playlists_list);
		        				},

				error: 			function(jqXHR, textStatus, errorThrown) {
									$("#console").append("1getting sample playlists failed </br>"); 
						        }
		});
	}
} else {
	$('#options').text(username);
	
	loading_indicator = getBusyOverlay("viewport",
					   		{color:'black', 
								opacity:0.5, 
								text:'Retrieving data', 
								style:'text-decoration:blink;font-weight:bold;font-size:12px;color:white'},
						   	{color:'#fff', 
								size:32, 
								type:'t'});
	
	// get numbers of playlists
	$.ajax({
	        type: 			"GET",
	        url: 			playlists_JSON_link,
			dataType:      'json',
	        success: 		function(json) {
								playlists_size = json.feed.openSearch$totalResults.$t;
								
								// gets the user's playlists from Youtube API and stores them into a JS object
								for (playlists_request_count = 0; playlists_request_count < Math.ceil(playlists_size/max_playlists_size); playlists_request_count++) {
									$.ajax({
									        type: 			"GET",
									        url: 			playlists_JSON_link,
											dataType:      'json',

											beforeSend: 	function(jqXHR) {
															},

									        success: 		function(json) {
																username = json.feed.author[0].name.$t;
																show_Settings_DDM();
																
																playlists.username = username;
																setCookie("Vekii", username, 30);

																playlists.playlists = new Array();

																for (playlists_index = 0; playlists_index < json.feed.entry.length; playlists_index++) {
																	playlist_size = json.feed.entry[playlists_index].yt$countHint.$t;

																	for (playlist_request_count = 0; playlist_request_count < Math.ceil(playlist_size/max_playlist_size); playlist_request_count++) {
																		// don't request the playlist if the playlist is private since Youtube API doesn't provide private playlist access
																		if (json.feed.entry[playlists_index].yt$private) {
																			playlists_size--;
																			break;
																		}

																		playlist_ajax_requests_sent_size++;

																		start_index = 1 + (playlist_request_count * 50);
																		playlist_link = json.feed.entry[playlists_index].content.src 
																							+ "&alt=json"
																							+ "&max-results=50"
																							+ "&start-index=" 
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
																									if (count == 1) {
																										break;
																									} else if (json.feed.entry[song_index].link[link_index].rel == "alternate") {
																										video_id = json.feed.entry[song_index].link[link_index].href.match(video_id_regexp)[0].substr(1);
																										count++;
																									} else if (link_index == json.feed.entry[song_index].link.length - 1) {
																										throw "Could not find video id or related videos feed.";
																									}
																								}
																								count = 0;

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
																								loading_indicator.remove();

																								// swfobject.embedSWF will load the player from YouTube and embed it onto your page.
																							    swfobject.embedSWF("http://www.youtube.com/v/u1zgFlCw8Aw?enablejsapi=1&playerapiid=ytplayer&version=3",
																							                       "yt_api_player", "640", "390", "8", null, null, params, atts);

																								playlists.playlists.sort(playlists_Sort_Func);

																								show_Playlists();
																								playlists_JSON = JSON.stringify(playlists);
																								
																								if (resync != true) {
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
																								} else {
																									update_Playlists();
																								}
																							}
																				   	      },

																		  	error:        function(jqXHR, textStatus, errorThrown) {
																							$("#output").append("<li>" + jqXHR.specialMessage + "</li>");
																		  		   	      }
																		});
																	}
																}
									        				},

											error: 			function(jqXHR, textStatus, errorThrown) {
																alert("Retreiving playlists from youtube failed.");
													        }
									});
								}
	        				},
			error: 			function(jqXHR, textStatus, errorThrown) {
								alert("Retriveing playlists_size failed.");
					        }
	});	
							
	
}
