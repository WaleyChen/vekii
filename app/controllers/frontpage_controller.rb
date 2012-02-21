class FrontpageController < ApplicationController
  def frontpage
    redirect_to "https://accounts.google.com/o/oauth2/auth?
                    client_id=908038792880.apps.googleusercontent.com&
                    redirect_uri=https://www.vekii.com/oauth2callback&
                    scope=https://gdata.youtube.com&
                    response_type=token"
    # @apiRequest = YouTube.post("/accounts/OAuthGetRequestToken?scope=http://gdata.youtube.com")
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