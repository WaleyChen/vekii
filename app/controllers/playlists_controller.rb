class PlaylistsController < ApplicationController
  # GET /photos (action: index) display a list of all photos
  # GET /photos/new (action: new) return an HTML form for creating a new photo  
  # POST /photos create (action: create) a new photo
  def create
    username = params[:username]
    puts username
    
    render :text => 'POST was successful.'
  end
  # GET /photos/:id show (action: display) a specific photo
  # GET /photos/:id/edit (action: edit)  return an HTML form for editing a photo
  # PUT /photos/:id update (action: update) a specific photo
  # DELETE  /photos/:id (action: destroy) delete a specific photo
end
