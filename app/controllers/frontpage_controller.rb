class FrontpageController < ApplicationController
  def frontpage
    @apiRequest = YouTube.post("/accounts/OAuthGetRequestToken?scope=http://gdata.youtube.com")
    @test = "Waley Chen"
    # @c = Curl::Easy.http_get("http://my.rails.box/thing/create") 
  end
end

class YouTube
  include HTTParty
  base_uri 'https://www.google.com'
  headers 'Content-Length' => ''
  headers 'Content-Type' => 'vekii.com' 
  headers 'Authorization' => 'OAuth
                              oauth_consumer_key=example.com,
                              oauth_signature_method=RSA-SHA1,
                              oauth_signature=wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D,
                              oauth_timestamp=137131200,
                              oauth_nonce=4572616e48616d6d65724c61686176,
                              oauth_version=1.0'
end