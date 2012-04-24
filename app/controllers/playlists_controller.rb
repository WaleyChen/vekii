require 'httparty'

class PlaylistsController < ApplicationController
  # GET /photos (action: index) display a list of all photos
  def index
    @playlists = Playlists.all
    
    respond_to do |format|
      format.html
      format.json { sample_playlists = Playlists.find_by_username("nikeelevet");
                    render :json => sample_playlists.playlists_JSON.to_json } 
    end
  end
  
  # GET /photos/new (action: new) return an HTML form for creating a new photo  
  # POST /photos create (action: create) a new photo
  def create
    username = params[:username]
    playlists_JSON = params[:playlists]
    
    if (!Playlists.find_by_username(username).nil?())
      render :text => 'Already exists in the database.'
    else 
      playlists = Playlists.new(:username => username, :playlists_JSON => playlists_JSON)
      playlists.save();
      render :text => 'POST was successful.'
    end
  end
  # GET /photos/:id show (action: display) a specific photo
  
  def delete_Playlist
    dev_Key = "AI39si5Cwgvp6TJAY4pqrUcK8dCcL8WntrOGNmmn6MBvBpN40Ru_pKF99Y0m-y_WJvLxtblt4REVaTqlQYsmr5Q05E1Bwvkmyw"
    playlist_id = params[:playlist_id]
    access_token = params[:access_token]
    
    response = HTTParty.delete('http://gdata.youtube.com/feeds/api/users/default/playlists/' + playlist_id + '?access_token=' + access_token, 
                                :headers => {'Content-Type' => 'application/atom+xml',
                                             'GData-Version' => '2',
                                             'X-GData-Key' => 'key=' + dev_Key})
    
    if (response.code == 200) 
      text = 'DELETE was successful.'
    else 
      text = response
    end
    
    render :text => text
  end
  
  # GET /playlists/:username show (action: get_Username_Playlists) username's playlists
  def get_Usernames_Playlists 
    username = params[:username]
    @playlists = Playlists.find_by_username(username);
    
    respond_to do |format|
      format.html
      format.json { render :json => @playlists.playlists_JSON.to_json } 
    end
  end
  
  # GET /photos/:id/edit (action: edit)  return an HTML form for editing a photo
  
  # PUT /playlists/:username update (action: update) a specific playlist
  def update
    username = params[:username]
    playlists_JSON = params[:playlists]
    
    playlists = Playlists.find_by_username(username);
    playlists.update_attributes(:playlists_JSON => playlists_JSON);
    render :text => 'PUT was successful.'
  end
  
  # DELETE  /photos/:id (action: destroy) delete a specific photo
end
