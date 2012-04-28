var playlist_showing;
var playlist_showing_bool = 0;

window.location.hash = "";

function add_Song_To_Playlist(playlist_id, video_id) {
	if (is_User_Logged_In()) {
		if (video_id == 'undefined') {
			apprise('Pick a song first!');
			return;
		}
		
		$.ajax({
			type: 'GET',
	        url: 'playlists/song/add/' + playlist_id + '/' + video_id + '?access_token=' + access_token,
	        success: function(response) {
	        		 	if (response != 'Adding the song was unsuccessful.') {
							$.ajax({
								type: 'GET',  
						        url: 'https://gdata.youtube.com/feeds/api/videos/' + video_id + '?v=2&alt=json',
								dataType: 'json',
						        success: function(json) {
											song = new Object();
											song.title = json.entry.title.$t;
											song.video_id = video_id;
											song.img = json.entry.media$group.media$thumbnail[0].url;
											playlist_entry_id = response;
											song.edit_url = 'https://gdata.youtube.com/feeds/api/playlists/' + playlist_id + '/' + playlist_entry_id +'?v=2'
											video_id_regexp = /[=][^&]+(?=&)/;
											
											jQuery.each(playlists.playlists, function(index, playlist) {
												if (playlist.id == playlist_id) { 
													playlist.songs.push(song);
													return false; 
												}
											});
											update_Playlists();
											show_Playlists(playlist_showing, 1); 
					    				 },
								error: function(jqXHR, textStatus, errorThrown) {
									alert(jqXHR);
									alert(textStatus);
									alert(errorThrown);
									apprise("Request failed.");
								}
							});
						} else {
							// don't raise error if there' no access_token which implies that the user is deleting
							// one of the sample playlists
							apprise('Add song failed');
							alert(response);
							
							if (access_token == undefined) {
							} else {
								// apprise(response);
							}
						}
    				 },
			error: function() {
				apprise("Request failed.");
			}
		});
	}
}

function delete_Playlist(playlist_id) {
	apprise('Are you sure?', 
			{'verify':true}, 
			function(response) {
				// user clicked 'Yes'
	    		if(response) { 
					jQuery.each(playlists.playlists, function(playlist_index, playlist) {
						if (playlist.id == playlist_id) { 
							playlists.playlists.splice(playlist_index, 1);

							if (playlist.id != playlist_id && playlist_showing_bool == 1) {
								playlist_showing_bool = 0;
								show_Playlists(playlist_showing, true);
							} else {
								show_Playlists();
							}

							return false;
						}
					});
					
					// before using the access token check if it's still valid else request a new one
					
					if (is_User_Logged_In()) {
						$.ajax({
							type: 'GET',
					        url: 'playlists/delete/' + playlist_id + '?access_token=' + access_token,
					        success: function(response) {
					        		 	if (response == 'DELETE was successful.') {
										} else {
											// don't raise error if there' no access_token which implies that the user is deleting
											// one of the sample playlists
											if (access_token == undefined) {
											} else {
												apprise(response);
											}
										}
			        				 },
							error: function() {
								apprise("Request failed.");
							}
						});
					
						update_Playlists();
					}
	        	} else { 
				}
			}
	);
}

function delete_Recommended(song_video_id) {
}

function delete_Song(playlist_id, song_video_id, edit_url) {	
	apprise('Are you sure?', {'verify':true}, function(response) {
		// user clicked 'Yes'
		if(response) { 
			jQuery.each(playlists.playlists, function(playlist_index, playlist) {
				if (playlist.id == playlist_id) { 
					jQuery.each(playlist.songs, function(song_index, song) {
						if (song.video_id == song_video_id) {
							playlists.playlists[playlist_index].songs.splice(song_index, 1);
							playlist_showing_bool = 0;
							show_Playlists(playlist_id);
							return false;
						}
					});
				}
			});
			
			edit_url_object = new Object();
			edit_url_object.edit_url = edit_url;
			edit_url_json = JSON.stringify(edit_url_object)
			
			// before using the access token check if it's still valid else request a new one
			
			if (is_User_Logged_In()) {
				$.ajax({
					type: 'POST',
					url: 'playlists/song/delete?access_token=' + access_token,
					contentType: 'application/json',
			        data: JSON.stringify(edit_url_json),
					processdata: false,
					beforeSend: function(jqXHR) {
									jqXHR.setRequestHeader('X-CSRF-Token', 
										$("meta[name='csrf-token']").attr('content'))
								},
			        success: function(response) {
			        		 	if (response == 'DELETE was successful.') {
								} else {
									// don't raise error if there' no access_token which implies that the user is deleting
									// one of the sample playlists
									if (access_token == undefined) {
									} else {
										apprise(response);
									}
								}
	        				 },
					error: function() {
						apprise("Request failed.");
					}
				});
				
				update_Playlists();
			}
		} else { 
		}
	});
}

function is_New_User(username) {
	$.ajax({
		type: 'GET',
        url: 'playlists/exists/' + username,
        success: function(response) {
        		 	if (response == 'DELETE was successful.') {
					} else {
						// don't raise error if there' no access_token which implies that the user is deleting
						// one of the sample playlists
						if (access_token == undefined) {
						} else {
							if (response == 'Yes.') {
								return true
							} else {
								return false;
							}
						}
					}
				 },
		error: function() {
			apprise("Request failed.");
		}
	});
}

function is_User_Logged_In() {
	if (username != undefined && username != 'undefined') {
		return true;
	} else {
		return false;
	}
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

function show_Playlists(playlist_to_show, show_playlist_bool) {		
	$("#playlists").html('');
	
	jQuery.each(playlists.playlists, function(index, playlist) {
		
		$('#playlists').append("<li class=\"playlist_list_img_and_txt\">"
			+ '<table class=\'width_img_and_txt\'>'
				+ '<tr>'
					+ '<td>'
						+ "<a class=\"playlist\" href=\"javascript:show_Playlists('" 
				  				+ playlist.id 
				   				+ "')\">"
							+ "<p class=\"playlist_img_txt\">"
								+ playlist.title 
							+ "</p>"
						+ "</a>"
					+ '</td>'
					+ '<td class=\'float_right\'>'
						+ "<a class=\"delete_playlist\"href=\"javascript:delete_Playlist(\'"
								+ playlist.id
								+ "\')\">"
							+ '<img src=\'assets/delete.png\' height=\'12\' width=\'12\'/>'
							// + "<i class=\"icon-remove\"> </i> "
						+ "</a>"
					+ '</td>'
				+ '</tr>'
			+ '</table>' 
		+ '</li>');
							 
		playlist.songs.sort(playlists_Sort_Func);
		
		if (playlist.id == playlist_to_show) { 
			jQuery.each(playlist.songs, function(index, song) {
				// for the delete_Song function, make the string parameter friendly
				// http://stackoverflow.com/questions/1873/triple-quotes-how-do-i-delimit-a-databound-javascript-string-parameter-in-asp-n
				// song_title_as_param = song.title.replace(/\'/g, "\'");
				// song_title_as_param = song_title_as_param.replace(/\"/g, "&#34;");
				
				if (index == 0) {
					$("#playlists").append("<ul id=\"playlist\" class=\"nav nav-list\">");
					$("#playlists").append("</ul>");
				}
				
				if (!playlist_showing_bool || playlist_showing != playlist_to_show || show_playlist_bool) {
					show_List_Img_And_Text_Of_Song("#playlists", playlist.id, song.title, song.video_id, song.img, song.edit_url);
				}
			});
		}
	});
	
	if (playlist_showing_bool === 0 || playlist_showing != playlist_to_show || show_playlist_bool) {
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
												+ access_token
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
					
						show_List_Img_And_Text_Of_Recommendation("#recommended", song.title.$t, video_id, img_url);					
					});
	   	       },
	  	error: function(jqXHR, textStatus, errorThrown) {
			   		throw 'AJAX call for related videos JSON feed failed.';
	  		   }
	});
}

function signout() {
	setCookie("Vekii", "undefined", 999);
	setCookie("Vekii_Access_Token", "undefined", 999);
	window.location = "http://localhost:3000/";
}

function update_Playlists() {
	playlists_JSON = JSON.stringify(playlists);
	
	if (username == undefined) {
		username = getCookie('Vekii');
	}
	
	$.ajax({
	        type: "PUT",
	        url: "playlists/update/" + username,
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