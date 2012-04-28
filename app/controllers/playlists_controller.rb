require 'httparty'

class HTTParty_JSON
  include HTTParty
  format :json
end

class PlaylistsController < ApplicationController
  def add_Song_To_Playlist
    access_token = params[:access_token]
    playlist_id = params[:playlist_id]
    video_id = params[:video_id]
    
    xml_json = HTTParty_JSON.post('http://gdata.youtube.com//feeds/api/playlists/' + playlist_id + '?access_token=' + access_token + '&v=2&alt=json', 
                                :headers => {'Content-Type' => 'application/atom+xml',
                                             'GData-Version' => '2',
                                             'X-GData-Key' => 'key=' + GlobalConstants::DEV_KEY},
                                :body => '<?xml version=\'1.0\' encoding=\'UTF-8\'?>' + 
                                          '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:yt=\'http://gdata.youtube.com/schemas/2007\'> <id>' + video_id + '</id> </entry>')

    # parse the playlist_entry_id
    id = xml_json['entry']['id']['$t']
    playlist_id_index = id.index(playlist_id);
    
    if (playlist_id_index != nil) 
      render :text => id[playlist_id_index + 17, 34]
    else
      render :text => 'Adding the song was unsuccessful.'
    end      
  end
  
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
    access_token = params[:access_token]
    playlist_id = params[:playlist_id]
    
    response = HTTParty.delete('http://gdata.youtube.com/feeds/api/users/default/playlists/' + playlist_id + '?access_token=' + access_token, 
                                :headers => {'Content-Type' => 'application/atom+xml',
                                             'GData-Version' => '2',
                                             'X-GData-Key' => 'key=' + GlobalConstants::DEV_KEY})
    
    if (response.code == 200) 
      text = 'DELETE was successful.'
    else 
      text = response
    end
    
    render :text => text
  end

  def delete_Song_From_Playlist
    access_token = params[:access_token]
    edit_url_json = params[:_json]
    edit_url_obj = ActiveSupport::JSON.decode(edit_url_json)

    response = HTTParty.delete(edit_url_obj['edit_url'] + '?access_token=' + access_token, 
                               :headers => {'Content-Type' => 'application/atom+xml',
                                            'Authorization' => 'AuthSub token=' + access_token,
                                            'GData-Version' => '2',
                                            'X-GData-Key' => 'key=' + GlobalConstants::DEV_KEY})
      
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
  
  # GET /photos (action: index) display a list of all photos
  def index
    @playlists = Playlists.all
    
    respond_to do |format|
      format.html
      format.json { sample_playlists = Playlists.find_by_username("nikeelevet");
                    render :json => sample_playlists.playlists_JSON.to_json } 
    end
  end
  
  def playlists_Exist? 
    username = params[:username]
    playlists = Playlists.find_by_username(username);
    
    if (playlists.nil?) 
      render :text => 'No.'
    else 
      render :text => 'Yes.'
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
