require 'rubygems'
require 'mechanize'
require 'open-uri'
require 'nokogiri'

class FrontpageController < ApplicationController
  def frontpage
    devKey = "AI39si5Cwgvp6TJAY4pqrUcK8dCcL8WntrOGNmmn6MBvBpN40Ru_pKF99Y0m-y_WJvLxtblt4REVaTqlQYsmr5Q05E1Bwvkmyw"
    @googleLoginLink = "https://accounts.google.com/o/oauth2/auth?"
      if ENV["RAILS_ENV"] = "test"
        client_id = "client_id=908038792880-vm3862hmpnp7u6gnmgd8104g8u7r1sr1.apps.googleusercontent.com"
        redirect_uri = "redirect_uri=http://localhost:3000/oauth2callback"
        gscope = "scope=https://gdata.youtube.com"
        response_type = "response_type=token"
      else 
      
      end
    @googleLoginLink = @googleLoginLink + client_id + '&' + redirect_uri + '&' + gscope + '&' + response_type
    @waleysPlaylistsJSONLink = "https://gdata.youtube.com/feeds/api/users/default/playlists?v=2" + "&access_token=" + "ya29.AHES6ZTIvqUzySTmEpoL-vwq57rObN1bsbA-RrZCg_wS7eexA1KVZX0"
  end
  
  def oAuth2Callback
    @request_original_url = request.url()
    @qp = request.request_parameters
  end
  
  def playlistsJSON
    send_file '/public/nikeelevet.json', 
  end
  
  def examplePlaylistJSON
    send_file '/public/example_playlist.json', 
  end
  
  def vekiiJS
    send_file '/app/assets/javascripts/vekii.js'
  end
  
  def sampleajax
    
  end
end

# class YouTube
#   def nonce()
#     return rand(10 ** 30).to_s.rjust(30,'0')
#   end
#   
#   include HTTParty
#   include OAuth
#   @timestamp = Time.now.to_time.to_i.to_s
#   base_uri 'https://www.google.com'
#   headers 'Content-Length' => ''
#   headers 'Content-Type' => 'application/x-www-form-urlencoded' 
#   headers 'Authorization' => 'OAuth
#                               oauth_consumer_key=vekii.com,
#                               oauth_signature_method=RSA-SHA1,
#                               oauth_signature=wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D,
#                               oauth_timestamp=' + @timestamp + '
#                               oauth_nonce=' + YouTube.nonce() + ',
#                               oauth_version=1.0'
#                               
#   consumer = Consumer.new(
#     'consumer token', 
#     'consumer secret', 
#     {:site => 'https://www.google.com'}
#   )
# end