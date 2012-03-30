var playlist_showing;
var playlist_showing_bool = 0;

window.location.hash = "";

function delete_Playlist(playlist_title) {
	jQuery.each(playlists.playlists, function(playlist_index, playlist) {
		if (playlist.title == playlist_title) { 
			playlists.playlists.splice(playlist_index, 1);
			
			if (playlist_title != playlist_showing && playlist_showing_bool == 1) {
				playlist_showing_bool = 0;
				show_Playlists(playlist_showing);
			} else {
				show_Playlists();
			}
			
			return false;
		}
	});

	playlists_JSON = JSON.stringify(playlists);

	$.ajax({
	        type: 			"PUT",
	        url: 			"playlists/" + username,
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

function delete_Recommended(song_video_id) {
}

function delete_Song(playlist_title, song_title) {
	jQuery.each(playlists.playlists, function(playlist_index, playlist) {
		if (playlist.title == playlist_title) { 
			jQuery.each(playlist.songs, function(song_index, song) {
				if (song.title == song_title) {
					playlists.playlists[playlist_index].songs.splice(song_index, 1);
					playlist_showing_bool = 0;
					show_Playlists(playlist_title);
					return false;
				}
			});
		}
	});
	
	playlists_JSON = JSON.stringify(playlists);

	$.ajax({
	        type: 			"PUT",
	        url: 			"playlists/" + username,
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

function login() {
	alert("login");
}

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

function show_Playlists(playlist_to_show) {	
	$("#playlists").html('');
	
	jQuery.each(playlists.playlists, function(index, playlist) {
		$("#playlists").append("<li class=\"left\">"
							  		+ "<a href=\"javascript:show_Playlists('" 
							  		+ playlist.title 
							   		+ "')\" width=50px >"
							   		+ playlist.title 
							   	+ "</a>"
								+ "</li>");
		
		$("#playlists").append("<a href=\"javascript:delete_Playlist(\'"
									+ playlist.title 
									+ "\')\">"
										+ "<li class=\"right\">"
											+ "<i class=\"icon-remove\"></i> "
								   		+ "</li>"  
										+ "</a>" 
										+ "</li>");
		
		playlist.songs.sort(playlists_Sort_Func);
		
		if (playlist.title == playlist_to_show) { 
			jQuery.each(playlist.songs, function(index, song) {
				// for the delete_Song function, make the string parameter friendly
				// http://stackoverflow.com/questions/1873/triple-quotes-how-do-i-delimit-a-databound-javascript-string-parameter-in-asp-n
				song_title_as_param = song.title.replace(/\'/g, "\\\'");
				song_title_as_param = song_title_as_param.replace(/\"/g, "&#34;");
				
				if (index == 0) {
					$("#playlists").append("<ul id=\"playlist\" class=\"nav nav-list\">");
					$("#playlists").append("</ul>");
				}
				
				if (!playlist_showing_bool || playlist_showing != playlist_to_show) {
					$("#playlist").append("<li>"
												+ "<a href=\"javascript:ytplayer.loadVideoById('" 
									  				+ song.video_id 
									  				+ "');"
													+ "javascript:show_Recommended('"
													+ song.video_id 
									  				+ "');"
													+ "\">" 
													+ song.title 
													+ " "
												+ "</a>"
												+ "<a href=\"javascript:delete_Song(\'"
													+ playlist.title 
													+ "\', \'"
													+ song_title_as_param
													+ "\')\" >"
														+ "<img src=\"/assets/delete.png\""
															+ "align=\"right\""
															+ "alt=\"delete.png\""
															+ "height=\"10\"" 
															+ "width=\"10\""
															+ "/>"  
												+ "</a>"
											+ "</li>");
				}
			});
		}
	});
	
	if (playlist_showing_bool === 0 || playlist_showing != playlist_to_show) {
		playlist_showing_bool = 1;
		playlist_showing = playlist_to_show;
	} else {
		playlist_showing_bool = 0;
		playlist_showing = "";
	}
}

function show_Recommended(song_video_id) {
	var song_related_videos_JSON_link = "https://gdata.youtube.com/feeds/api/videos/" 
											+ song_video_id 
											+ "/related?v=2"
											+ "&alt=json" 
											+ "&access_token=" 
											+ hash_values_json.access_token
											+ "&key="
											+ dev_Key;
	
	// get the related videos JSON feed
	$.ajax({
		type:  		   'GET',
	  	url:           song_related_videos_JSON_link,
	  	dataType:      'json',

	    beforeSend:    function(jqXHR) {
					   }, 

	  	success:       function(json, textStatus, jqXHR) {
							video_id_regexp = /[=][^&]+(?=&)/;
		
							$("#recommended").html('');
							
							jQuery.each(json.feed.entry, function(song_index, song) {
								// the video id should be in the link array else throw an exception
								count = 0;
								for (link_index = 0; link_index < song.link.length; link_index++) {
									if (count == 1) {
										break;
									} else if (song.link[link_index].rel == "alternate") {
										video_id = song.link[link_index].href.match(video_id_regexp)[0	].substr(1);
										count++;
									} else if (link_index == song.link.length - 1) {
										throw "Could not find video id or related videos feed.";
									}
								}
												
								$("#recommended").append("<li>"
															+ "<a href=\"javascript:ytplayer.loadVideoById('" 
												  				+ video_id 
												  				+ "');"
																+ "\">" 
																+ song.title.$t
																+ " "
															+ "</a>"
															+ "<a href=\"javascript:delete_Recommendation(\'"
																+ song.title.$t
																+ "\', \'"
																+ song_title_as_param
																+ "\')\" >"
																	+ "<img src=\"/assets/delete.png\""
																		+ "align=\"right\""
																		+ "alt=\"delete.png\""
																		+ "height=\"10\"" 
																		+ "width=\"10\""
																		+ "/>"  
															+ "</a>"
														+ "</li>");
							});
			   	       },

	  	error:         function(jqXHR, textStatus, errorThrown) {
							throw 'AJAX call for related videos JSON feed failed.';
	  		   	       }
	});
}