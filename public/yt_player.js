// Once the player is ready, it wil call onYouTubePlayerReady.
function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("myytplayer");
	ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}

function onytplayerStateChange(newState) {
    // $('#console').append(newState);

	if (newState == 0) {
		if ($('#replay_btn').html() == "<del> Replay </del>") {
			ytplayer.loadVideoById(current_video_id, 0, 'highres');
		} else {
		}
	}
}