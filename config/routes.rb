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
  get 'playlists' => 'playlists#index'
  post 'playlists' => 'playlists#create'
  put 'playlists/update/:username' => 'playlists#update'
  get 'playlists/:username' => 'playlists#get_Usernames_Playlists'
  get 'playlists/exists/:username' => 'playlists#playlists_Exist?'
  get 'playlists/delete/:playlist_id' => 'playlists#delete_Playlist'

  get 'playlists/song/add/:playlist_id/:video_id' => 'playlists#add_Song_To_Playlist'
  post 'playlists/song/delete' => 'playlists#delete_Song_From_Playlist'
  
  match 'user' => 'user#index'
  match 'createUser' => 'user#createUser'
  match 'createUserForm' => 'user#createUserForm'
  match '/user/playlists/:username' => 'user#playlistJSON'
  
  match 'playlists.json' => 'frontpage#playlistsJSON'
  match 'example_playlist.json' => 'frontpage#examplePlaylistJSON'
  
  # ASSETS
    # JAVASCRIPT
    match 'player.js' => 'frontpage#player_JS'
    match 'cookie.js' => 'frontpage#cookie_JS'
    match 'cvi_busy_lib.js' => 'frontpage#cvi_Busy_Lib_JS'
    match 'validate_token.js' => 'frontpage#validate_Token_JS'
    match 'retrieve_playlists.js' => 'frontpage#retrive_Playlists_JS'
    match 'yt_player.js' => 'frontpage#yt_Player_JS'
    match 'search.js' => 'frontpage#search_JS'
    match 'monkey.js' => 'frontpage#monkey_JS'
    # IMAGES
    match 'delete.png' => 'frontpage#delete_PNG'
end
