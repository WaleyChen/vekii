Vekii::Application.routes.draw do
  root :to => 'frontpage#frontpage'
  
  match 'oauth2callback' => 'frontpage#oAuth2Callback'
  match 'sampleajax' => 'frontpage#sampleajax'
  match 'playlist' => 'playlist#playlist'
  
  resources :playlists
  
  match 'user' => 'user#index'
  match 'createUser' => 'user#createUser'
  match 'createUserForm' => 'user#createUserForm'
  match '/user/playlists/:username' => 'user#playlistJSON'
  
  match 'playlists.json' => 'frontpage#playlistsJSON'
  match 'example_playlist.json' => 'frontpage#examplePlaylistJSON'
  
  # ASSETS
    # JAVASCRIPT
    match 'retrive_playlists.js' => 'frontpage#retrieve_Playlists_JS'
    match 'validate_token.js' => 'frontpage#validate_Token_JS'
    match 'vekii_backbone.js' => 'frontpage#vekii_Backbone_JS'
    match 'yt_player' => 'frontpage#yt_Player_JS'
    match 'player' => 'frontpage#player_JS'
  
    # IMAGES
    match 'delete.png' => 'frontpage#delete_PNG'
end
