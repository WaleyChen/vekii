// to-do
// If the user refused to grant access to your application, Google will have included the access_denied error message in the
// hash fragment of the redirect_uri: http://localhost/oauth2callback#error=access_denied
document.write("</br>");

// link for testing environment
var googleLoginLink    = "https://accounts.google.com/o/oauth2/auth?";
var client_id          = "client_id=908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com";
var redirect_uri       = "redirect_uri=http://localhost:3000/oauth2callback";
var gscope             = "scope=https://gdata.youtube.com";
var response_type      = "response_type=token";
var googleLoginLink    = googleLoginLink + client_id + '&' + redirect_uri + '&' + gscope + '&' + response_type;

// to-do
// link for production environment

(function ($) {
	$.ajaxSetup ({
		cache: false
	});

	Friend               = Backbone.Model.extend({
		//Create a model to hold friend atribute
		name: null
	});

	Friends              = Backbone.Collection.extend({
		//This is our Friends collection and holds our Friend models
		initialize: function (models, options) {
			this.bind("add", options.view.addFriendLi);
			//Listen for new additions to the collection and call a view function if so
		}
	});

	AppView              = Backbone.View.extend({
		el: $("body"),
		initialize: function () {
			this.friends     = new Friends( null, { view: this });
			//Create a friends collection when the view is initialized.
			//Pass it a reference to this view to create a connection between the two
		},
		events: {
			"click #add-friend":  "showPrompt",
			"click #validate-token":  "validateToken",
		},
		showPrompt: function () {
			var friend_name  = prompt("Who is your friend?");
			var friend_model = new Friend({ name: friend_name });
			//Add a new friend model to our friend collection
			this.friends.add( friend_model );
		},
		validateToken: function() {
			$("#validate-token-link").append("<li>" + "getAccessToken called" + "</li>");
			$("#friends-list").append("<li>" + "getAccessToken called" + "</li>");
			jQuery.ajax(googleLoginLink);
			$.ajax({ type: "GET", url: validate_token_link, dataType: "jsonp", success: readData(data) });
		},
		addFriendLi: function (model) {
			//The parameter passed is a reference to the model that was added
			$("#friends-list").append("<li>" + model.get('name') + "</li>");
			//Use .get to receive attributes of the model
		}
	});

	var appview = new AppView;
	})(jQuery);