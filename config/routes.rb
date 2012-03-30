Vekii::Application.routes.draw do
  root :to => 'frontpage#frontpage'
  
  match 'oauth2callback' => 'frontpage#oAuth2Callback'
  match 'sampleajax' => 'frontpage#sampleajax'
  
  match 'playlist' => 'playlist#playlist'

  # get '/images' => 'images#index'           # list all images
  # get '/images/:id' => 'images#show'        # show one image
  # get '/images/new' => 'images#new'         # get form to create image
  # post '/images' => 'images#create'         # create image
  # get '/images/:id/edit' => 'images#edit'   # get form to edit image
  # put '/images/:id' => 'images#update'      # update image
  # delete '/images/:id' => 'images#destroy'  # delete image
  get  'playlists' => 'playlists#index'
  post 'playlists' => 'playlists#create'
  get  'playlists/:username' => 'playlists#get_Usernames_Playlists'
  
  match 'user' => 'user#index'
  match 'createUser' => 'user#createUser'
  match 'createUserForm' => 'user#createUserForm'
  match '/user/playlists/:username' => 'user#playlistJSON'
  
  match 'playlists.json' => 'frontpage#playlistsJSON'
  match 'example_playlist.json' => 'frontpage#examplePlaylistJSON'
  
  # ASSETS
    # IMAGES
    match 'delete.png' => 'frontpage#delete_PNG'
end
