$(document).ready(function() {	
	if (username != undefined) {
		$('#options').html(username + " <b class=\"caret\"></b>");
	} else {
		$('#options').html("Login");
	}
	
	$("#.search").keyup(function() 
	{
		alert("woop");
		var search_input = $(this).val();
		var keyword= encodeURIComponent(search_input);
		// Youtube API 
		var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+keyword+'&format=5&max-results=1&v=2&alt=jsonc '; 

		$.ajax
		({
			type: "GET",
			url: yt_url,
			dataType:"jsonp",
			success: function(response)
			{

				if(response.data.items)
				{
					$.each(response.data.items, function(i,data)
					{
						var video_id=data.id;
						var video_title=data.title;
						var video_viewCount=data.viewCount;
						// IFRAME Embed for YouTube
						var video_frame="<iframe width='640' height='385' src='http://www.youtube.com/embed/"+video_id+"' frameborder='0' type='text/html'></iframe>";

						var final="<div id='title'>"+video_title+"</div><div>"+video_frame+"</div><div id='count'>"+video_viewCount+" Views</div>";

						$("#result").html(final); // Result

						});
					}
					else
					{
						$("#result").html("<div id='no'>No Video</div>");
					}
				}
		});
	});
});
