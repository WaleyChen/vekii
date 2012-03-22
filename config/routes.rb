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
end
