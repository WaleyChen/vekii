function delete_Playlist(playlist_title) {
	jQuery.each(playlists.playlists, function(playlist_index, playlist) {
		if (playlist.title == playlist_title) { 
			playlists.playlists.splice(playlist_index, 1);
			show_Playlists();
			return false;
		}
	});
}

function delete_Song(playlist_title, song_title) {
	jQuery.each(playlists.playlists, function(playlist_index, playlist) {
		if (playlist.title == playlist_title) { 
			jQuery.each(playlist.songs, function(song_index, song) {
				if (song.title == song_title) {
					playlists.playlists[playlist_index].songs.splice(song_index, 1);
					show_Playlists(playlist_title);
					return false;
				}
			});
		}
	});
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
		$("#playlists").append("<li><a href=\"javascript:show_Playlists('" 
							   + playlist.title 
							   + "')\">"
							   + playlist.title 
							   + "</a>");
		$("#playlists").append("<a href=\"javascript:delete_Playlist(\'"
								+ playlist.title 
								+ "\')\" >"
									+ "<img src=\"/assets/delete.png\""
									+ "align=\"right\""
									+ "alt=\"delete.png\""
									+ "height=\"10\"" 
									+ "width=\"10\""
									+ "/>"  
								+ "</a></li>");

		/*
								<div class="well" style="padding: 8px 0;">
								        <ul class="nav nav-list">
								          <li class="active"><a href="#"><i class="icon-home icon-white"></i> Home</a></li>
								          <li><a href="#"><i class="icon-book"></i> Library</a></li>
								          <li><a href="#"><i class="icon-pencil"></i> Applications</a></li>
								          <li><a href="#">Misc</a></li>
								        </ul>
								      </div> <!-- /well -->
		*/
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
				
				$("#playlist").append("<li>"
										+ "<a href=\"javascript:ytplayer.loadVideoById('" 
									  	+ song.video_id 
									  	+ "')\">" 
										+ song.title 
										+ " "
										+ "</a>");
				$("#playlist").append("<a href=\"javascript:delete_Song(\'"
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
			});
		}
												
		playlists_JSON = JSON.stringify(playlists);
	});
}