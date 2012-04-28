if ((username == undefined || username == 'undefined') && logged_in == 0) {
	$(document).ready(function() {
		$('#login_msg').append('<span class=\"center label label-info\">These are my playlists! To see yours, login!</span>');
	});
}

function replay() {
	if ($('#replay_btn').html() == "Replay") {
		$('#replay_btn').html('<del>Replay</del>');
	} else {
		$('#replay_btn').html('Replay');
	}
}

function remove_Loading_Indicator(current_video_id_playing) {
	loading_indicator.remove();
}

function show_Add_To_Playlist_DDM() {
	$('#add_to_playlist_ddm').empty();

	playlists_list = '';
	
	jQuery.each(playlists.playlists, function(index, playlist) {
		playlists_list = playlists_list + '<li>'
											+ '<a href=\'javascript:add_Song_To_Playlist(' 
											+ '\"' + playlist.id + '\"' + ', '
											+ '\"' +  current_video_id_playing + '\"'
										+ ')\'>' + playlist.title + '</a></li>';
	});
	
	$('#add_to_playlist_ddm').append( "<ul class=\"nav nav-pills inline\">"
										+ "<li class=\"dropdown\" id=\"add_to_playlist_ddm_href\">"
											+ "<a class=\"dropdown-toggle border_style_solid border_width_1px\" data-toggle=\"dropdown\" href=\"#add_to_playlist_ddm_href\">"
												+  "Add to"
											+ "</a>"
											+ "<ul id=\'playlist_ddm_playlists_list\' class=\"dropdown-menu height_ddm\">"
												+ playlists_list
											+ "</ul>"
										+ "</li>"
									+ "</ul>");
}

function show_List_Img_And_Text_Of_Song(dom_element, playlist_id, song_title, song_video_id, song_img_url, song_edit_url) {
	$(dom_element).append("<li class=\"list_img_and_txt\">"
		+ '<table class=\'width_img_and_txt\'>'
			+ '<tr>'
				+ '<td>'
					+ "<a href=\"javascript:play_Video('" 
	  					+ song_video_id 
	  	    		+ "');\">" 
						+ "<img class=\"img\" src=\"" + song_img_url + "\" />"
						+ "<p class=\"img_txt\">"
							+ song_title
						+ "</p>"
					+ "</a>"
				+ '</td>'
				+ '<td class=\'float_right margins_txt_and_icon\'>'
					+ '<a href=\'javascript:delete_Song(' 
						+ '\"' + playlist_id + '\"' + ', '
						+ '\"' + song_video_id + '\"' + ', '
	  					+ '\"' + song_edit_url + '\"'
	  	    		+ ');\'>'
						+ '<img class=\'position_absolute\' src=\'assets/delete.png\' height=\'12\' width=\'12\'/>'
						// +'<i class=\"icon-remove position_absolute\"> </i> '
					+ "</a>"
				+ '</td>'
			+ '</tr>'
		+ '</table>' 
	+ '</li>');
}

function show_List_Img_And_Text_Of_Recommendation(dom_element, song_title, song_video_id, song_img_url) {
	$(dom_element).append("<li class=\"list_img_and_txt\">"
							+ '<table class=\'width_img_and_txt\'>'
								+ '<tr>'
									+ '<td>'
										+ "<a href=\"javascript:play_Video('" 
						  					+ song_video_id 
						  	    		+ "');\">" 
											+ "<img class=\"img\" src=\"" + song_img_url + "\" />"
											+ "<p class=\"img_txt\">"
												+ song_title
											+ "</p>"
										+ "</a>"
									+ '</td>'
									+ '<td class=\'float_right margins_txt_and_icon\'>'
									//	+ '<i class=\"icon-remove position_absolute\"> </i> '
									+ '</td>'
								+ '</tr>'
							+ '</table>' 
						+ '</li>');
}

function show_Loading_Indicator() {
	loading_indicator = getBusyOverlay('viewport',
					   				   {color:'black', 
										opacity:0.5, 
										text:'Retrieving data', 
										style:'text-decoration:blink;font-weight:bold;font-size:12px;color:white'},
						   			   {color:'#fff', 
										size:32, 
										type:'t'});
}

function show_Login_Button() {
	$(document).ready(function() {	
		// alert(request_access_token_link);
		$('#login_button_ddm').append('<a class=\'btn\' href=\'' + request_access_token_link +'\'>Login</a>');
		$('#yt_api_player_wrapper').css("margin-top", "20px");
	});
}

function show_Settings_DDM() {
	$(document).ready(function() {
		$('#settings_ddm').append( "<center>" + "<ul class=\"nav nav-pills padding_top_login_button pull-right\">"
		  							+ "<li class=\"dropdown\" id=\"settings_ddm_href\">"
										+ "<a id=\"options\" class=\"dropdown-toggle border_style_solid border_width_1px\" data-toggle=\"dropdown\" href=\"#settings_ddm_href\">"
											+ username
										+ "</a>"
										+ "<ul class=\"dropdown-menu\">"
											+ "<li class=\"\"><a href=\"javascript:signout();\">Sign Out</a></li>"
										+ "</ul>"
									+ "</li>"
								+ "</ul>" + "</center>");
	});
}