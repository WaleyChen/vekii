class FrontpageController < ApplicationController
  def frontpage
    @apiRequest = HTTParty.get("https://gdata.youtube.com/feeds/api/videos?q=SEARCH_TERM&key=AI39si5Cwgvp6TJAY4pqrUcK8dCcL8WntrOGNmmn6MBvBpN40Ru_pKF99Y0m-y_WJvLxtblt4REVaTqlQYsmr5Q05E1Bwvkmyw")
    @test = "Waley Chen"
    @c = Curl::Easy.http_get("http://my.rails.box/thing/create")
  end
end
