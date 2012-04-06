// AJAX vars
var devKey = "AI39si5Cwgvp6TJAY4pqrUcK8dCcL8WntrOGNmmn6MBvBpN40Ru_pKF99Y0m-y_WJvLxtblt4REVaTqlQYsmr5Q05E1Bwvkmyw"
var googleLoginLink = "https://accounts.google.com/o/oauth2/auth?"
var client_id = "client_id=908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com"
var gscope = "scope=https://gdata.youtube.com"
var response_type = "response_type=token"
var redirect_uri = "redirect_uri=http://localhost:3000"

/*
# construct the link to request an access token from the Youtube API
if ENV["RAILS_ENV"] == "development" || ENV["RAILS_ENV"] == "vekii_test"
  redirect_uri = "redirect_uri=http://localhost:3000"
elsif ENV["RAILS_ENV"] == "production"
  redirect_uri = "redirect_uri=http://fierce-stream-3563.herokuapp.com/"
end
*/

var resync_link = googleLoginLink + client_id + '&' + redirect_uri + "/?resync=true" + '&' + gscope + '&' + response_type;
googleLoginLink = googleLoginLink + client_id + '&' + redirect_uri + '&' + gscope + '&' + response_type;

$(document).ready(function() {	
	if (username != undefined & username != "undefined") {	
	} else {
		$('#login_button_or_settings_ddm').append("<a class=\"btn\" href=\"" + googleLoginLink + "\"> Login </a>");
		$('#yt_api_player_wrapper').css("margin-top", "20px");
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
