function show_Add_To_Playlist_DDM(playlists_list) {
	$('#add_to_playlist_ddm').append( "<ul class=\"nav nav-pills inline\">"
										+ "<li class=\"dropdown\" id=\"menu2\">"
											+ "<a class=\"dropdown-toggle border_style_solid border_width_1px\" data-toggle=\"dropdown\" href=\"#menu2\">"
												+  "Add to"
											+ "</a>"
											+ "<ul class=\"dropdown-menu height_ddm\">"
												+ playlists_list
											+ "</ul>"
										+ "</li>"
									+ "</ul>");
}

function show_List_Img_And_Text(dom_element, song_title, song_video_id, song_img_url) {
	$(dom_element).append("<li class=\"list_img_and_txt\">"
							+ "<a href=\"javascript:play_Video('" 
					  			+ song_video_id 
					  	    + "');\">" 
							+ "<img class=\"img\" src=\"" + song_img_url + "\" />"
								+ "<p class=\"img_txt\">"
									+ song_title
								+ "</p>"
							+ "</a>"
						+ "</li>" 
						+ "</br>");
}

function show_Login_Button() {
	$(document).ready(function() {	
		$('#login_button_ddm').append("<a class=\"btn\" href=\"javascript:get_Access_Token()\">Login</a>");
		$('#yt_api_player_wrapper').css("margin-top", "20px");
	});
}

function show_Settings_DDM() {
	$(document).ready(function() {
		// $('#login_button_or_settings_ddm').html('');
		$('#settings_ddm').append("<ul class=\"nav nav-pills padding_top_login_button pull-right\">"
		  							+ "<li class=\"dropdown\" id=\"settings\">"
										+ "<a id=\"options\" class=\"dropdown-toggle border_style_solid border_width_1px\" data-toggle=\"dropdown\" href=\"#settings\">"
											+ username
										+ "</a>"
										+ "<ul class=\"dropdown-menu\">"
											+ "<li class=\"float_right\"><a href=\"javascript:signout();\">Sign Out</a></li>"
											+ "<li class=\"float_right\"><a href=\"" + resync_link + "\"> Resync </a></li>"
										+ "</ul>"
									+ "</li>"
								+ "</ul>");
	});
}