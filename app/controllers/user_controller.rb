class UserController < ApplicationController
  respond_to :json
  
  def index
    @users = User.all
    
    respond_to do |format|
        format.html # index.html.erb
        format.xml  { render :xml => @users }
        format.json { render :json => @users }
    end
  end
  
  def createUserForm
    @user = User.new(params[:user])
    
  end
  
  def createUser
    @user = User.new(params[:user])
    @user.save
  end
  
  def playlistJSON
    @user = User.find_by_username(params[:username])
    @playlists = @user.playlists
    @playlistsJSON = @playlist.to_json
  end
end