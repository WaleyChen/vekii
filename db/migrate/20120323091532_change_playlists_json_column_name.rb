class ChangePlaylistsJsonColumnName < ActiveRecord::Migration
  def up
    rename_column :playlists, :playlistsJSON, :playlists_JSON
  end

  def down
  end
end
