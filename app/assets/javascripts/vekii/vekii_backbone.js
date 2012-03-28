// link for testing environment
var googleLoginLink    = "https://accounts.google.com/o/oauth2/auth?";
var client_id          = "client_id=908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com";
var redirect_uri       = "redirect_uri=http://localhost:3000/oauth2callback";
var gscope             = "scope=https://gdata.youtube.com";
var response_type      = "response_type=token";
var googleLoginLink    = googleLoginLink + client_id + '&' + redirect_uri + '&' + gscope + '&' + response_type;

// to-do
// link for production environment

(function($) {
	// MODELS
	window.Playlist_Model = Backbone.Model.extend({
    });

	// COLLECTIONS
	window.Playlist_Collection = Backbone.Collection.extend({
        model: Playlist_Model,
        url: "/playlists.json"
    });
	
	window.playlists_bb = new Playlist_Collection(); // bb meaning backbone since we already have a playlists var 
	playlists_bb.fetch();
})(jQuery);