var googleLoginLink = "https://accounts.google.com/o/oauth2/auth?"
var client_id = "client_id=908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com"
var gscope = "scope=https://gdata.youtube.com"
var response_type = "response_type=token"
var redirect_uri = "redirect_uri=http://localhost:3000"
var resync_link = googleLoginLink + client_id + '&' + redirect_uri + "/?resync=true" + '&' + gscope + '&' + response_type;
googleLoginLink = googleLoginLink + client_id + '&' + redirect_uri + '&' + gscope + '&' + response_type;

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

function show_Login_Button() {
	$(document).ready(function() {	
		$('#login_button_ddm').append("<a class=\"btn\" href=\"" + googleLoginLink + "\"> Login </a>");
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

function signout() {
	setCookie("Vekii", "undefined");
	window.location = "http://localhost:3000/";
}