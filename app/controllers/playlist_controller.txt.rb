class PlaylistController < ApplicationController
  respond_to :json
 
  def index
    @lists = List.all
    respond_with(@lists)
  end
end