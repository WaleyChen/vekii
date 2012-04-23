var current_video_id_playing;

// Once the player is ready, it wil call onYouTubePlayerReady.
function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("myytplayer");
	ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}

function play_Video(video_id) {
	$('html, body').animate({ scrollTop: 0 }, 0);
	current_video_id_playing = video_id;
	ytplayer.loadVideoById(video_id);
	show_Recommended(video_id);
}

function onYTPlayerStateChange(newState) {
    // $('#console').append(newState);
	if (newState == 0) {
		if ($('#replay_btn').html() == "<del> Replay </del>") {
			ytplayer.loadVideoById(current_video_id, 0, 'highres');
		} else {
		}
	}
}

