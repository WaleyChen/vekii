var playlist_showing;
var playlist_showing_bool = 0;

window.location.hash = "";

function delete_Playlist(playlist_id) {
	apprise('Are you sure?', 
			{'verify':true}, 
			function(response) {
				// user clicked 'Yes'
	    		if(response) { 
					jQuery.each(playlists.playlists, function(playlist_index, playlist) {
						if (playlist.id == playlist_id) { 
							playlists.playlists.splice(playlist_index, 1);

							if (playlist.title != playlist_showing && playlist_showing_bool == 1) {
								playlist_showing_bool = 0;
								show_Playlists(playlist_showing);
							} else {
								show_Playlists();
							}

							return false;
						}
					});
					
					$.ajax({
						dataType: 'jsonp',
						type: 'DELETE',
				        url: 'https://gdata.youtube.com/feeds/api/users/default/playlists/' 
								+ playlist_id 
						   + '?access_token='
								+ hash_values_json.access_token
								+ '&callback=?',
						headers: { 
							'Access-Control-Allow-Origin': '*',
						        'contentType': "application/atom+xml",
								'GData-Version': '2',
									'X-GData-Key': 'key=' + dev_Key
						    },
						beforeSend: function(jqXHR) {
										jqXHR.setRequestHeader('Access-Control-Allow-Origin', '*');
									},
				        success: function(response) {
				        					if (response == 'POST was successful.') {
											} else if (response == 'Already exists in the database.'){
											}
				        				},
						error: function() {
							apprise("Delete of playlist failed.");
						}
					});
					
					update_Playlists();
	        	} else { 
				}
			}
	);
}

function delete_Recommended(song_video_id) {
}

function delete_Song(playlist_title, song_title) {
	apprise('Ready to begin?', {'verify':true}, function(r)
	    {
	    if(r)
	        { 
	        // user clicked 'Yes'

	        }
	    else
	        { 
	        // user clicked 'No'

	        }
	    });
	
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
	
	update_Playlists();
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

function replay() {
	if ($('#replay_btn').html() == "Replay") {
		$('#replay_btn').html('<del> Replay </del>');
	} else {
		$('#replay_btn').html('Replay');
	}
}

function show_Playlists(playlist_to_show) {		
	$("#playlists").html('');
	
	jQuery.each(playlists.playlists, function(index, playlist) {
		
		$("#playlists").append("<li>"
							  		+ "<a class=\"playlist\" href=\"javascript:show_Playlists('" 
							  				+ playlist.title 
											// + playlist.img
							   				+ "')\">"
							   			+ playlist.title 
										+ "<a class=\"delete_playlist\"href=\"javascript:delete_Playlist(\'"
												+ playlist.id
												+ "\')\">"
											+ "<i class=\"icon-remove\"> </i> "
										+ "</a>" 
										+ "<a class=\"delete_playlist\"href=\"javascript:delete_Playlist(\'"
												+ playlist.id
												+ "\')\">"
											+ "<i class=\"icon-play\"> </i> "
										+ "</a>"
									+ "</a>"
								+ "</li>");
							 
		playlist.songs.sort(playlists_Sort_Func);
		
		if (playlist.title == playlist_to_show) { 
			jQuery.each(playlist.songs, function(index, song) {
				// for the delete_Song function, make the string parameter friendly
				// http://stackoverflow.com/questions/1873/triple-quotes-how-do-i-delimit-a-databound-javascript-string-parameter-in-asp-n
				song_title_as_param = song.title.replace(/\'/g, "\'");
				song_title_as_param = song_title_as_param.replace(/\"/g, "&#34;");
				
				if (index == 0) {
					$("#playlists").append("<ul id=\"playlist\" class=\"nav nav-list\">");
					$("#playlists").append("</ul>");
				}
				
				if (!playlist_showing_bool || playlist_showing != playlist_to_show) {
					/*
					$("#playlists").append("<li>"
										  		+ "<a class=\"playlist\" href=\"" 
														+ "javascript:play_Video('"
															+ song.video_id
														+ "');\">"
													+ "&nbsp"
										   			+ song.title  
													+ "<a class=\"delete_playlist\"href=\"javascript:delete_Song(\'"
															+ playlist.title 
															+ "\', \'"
															+ song_title_as_param
															+ "\')\" >"
														+ "<i class=\"icon-remove\"> </i>"
													+ "</a>" 
												+ "</a>"
											+ "</li>");
					*/
					show_List_Img_And_Text("#playlists", song_title_as_param, song.video_id, song.img);
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
	var img_url = "";
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
		type: 'GET',
	  	url: song_related_videos_JSON_link,
	  	dataType: 'json',
	    beforeSend: function(jqXHR) {
					}, 
	  	success: function(json, textStatus, jqXHR) {
					video_id_regexp = /[=][^&]+(?=&)/;

					$("#recommended").html('');
					
					jQuery.each(json.feed.entry, function(song_index, song) {
						img_url = json.feed.entry[song_index].media$group.media$thumbnail[0].url;
						
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
					
						show_List_Img_And_Text("#recommended", song.title.$t, video_id, img_url);					
					});
	   	       },
	  	error: function(jqXHR, textStatus, errorThrown) {
			   		throw 'AJAX call for related videos JSON feed failed.';
	  		   }
	});
}

function update_Playlists() {
	playlists_JSON = JSON.stringify(playlists);
	
	if (username == undefined) {
		username = getCookie('Vekii');
	}
	
	$.ajax({
	        type: "PUT",
	        url: "playlists/" + username,
			contentType: "application/json",
	        data: playlists_JSON,
			processdata: false,
			beforeSend: function(jqXHR) {
							jqXHR.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
						},		
	        success: function(response) {
	        		 },
			error: function(jqXHR, textStatus, errorThrown) {
				   		throw 'Updating playlists failed.';
				   }
	});
}