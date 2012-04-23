// from http://www.9lessons.info/2010/09/youtube-instant-search-with-jquery-and.html
$(document).ready(function() {	
	$(".search").keyup(function() {
		var search_input = $(this).val();
		var keyword = encodeURIComponent(search_input);
		var yt_url = 'http://gdata.youtube.com/feeds/api/videos?q=' + keyword + '&format=5&max-results=10&v=2&alt=json'; 
		
		$.ajax ({
			type: "GET",
			url: yt_url,
			dataType:"json",
			success: function(json) {
				for (video_index = 0; video_index < json.feed.entry.length; video_index++) {
					$('#console').append(json.feed.entry[video_index].title.$t);
				}
			}
		});
	});
});
