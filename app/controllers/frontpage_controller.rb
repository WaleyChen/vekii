require 'rubygems'
require 'mechanize'
require 'open-uri'
require 'nokogiri'

class FrontpageController < ApplicationController
  def frontpage
    devKey = "AI39si5Cwgvp6TJAY4pqrUcK8dCcL8WntrOGNmmn6MBvBpN40Ru_pKF99Y0m-y_WJvLxtblt4REVaTqlQYsmr5Q05E1Bwvkmyw"
    @googleLoginLink = "https://accounts.google.com/o/oauth2/auth?"
    client_id = "client_id=908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com"
    gscope = "scope=https://gdata.youtube.com"
    response_type = "response_type=token"
    
    # redirect_uri = "redirect_uri=http://localhost:3000/oauth2callback"
    # construct the link to request an access token from the Youtube API
    if ENV["RAILS_ENV"] == "development" ||ENV["RAILS_ENV"] == "vekii_test"
      redirect_uri = "redirect_uri=http://localhost:3000/oauth2callback"
    elsif ENV["RAILS_ENV"] == "vekii_production"
      redirect_uri = "redirect_uri=http://smooth-warrior-1237.herokuapp.com/oauth2callback"
    end
    // 
    @googleLoginLink = @googleLoginLink + client_id + '&' + redirect_uri + '&' + gscope + '&' + response_type
  end
  
  def oAuth2Callback
  end
  
  def playlistsJSON
    send_file '/public/nikeelevet.json', 
  end
  
  def retrive_Playlists_JS
    send_file '/public/js/retreive_playlists.js', 
  end
  
  def validate_Token_JS
    send_file '/public/js/validate_token.js', 
  end
  
  def vekii_Backbone_JS
    send_file '/public/js/vekii_backbone.js', 
  end
  
  def yt_Player_JS
    send_file '/public/js/yt_player.js', 
  end
  
  def player_JS
    send_file '/public/js/player.js', 
  end
  
  def examplePlaylistJSON
    send_file '/public/example_playlist.json', 
  end
  
  def vekiiJS
    send_file '/public/vekii.js'
  end
  
  def backboneJS
    send_file '/public/vekii_backbone.js'
  end
  
  def playlistsJSON
    send_file '/public/playlists.json'
  end
  
  def delete_PNG
    send_file '/public/images/delete.png'
  end
end