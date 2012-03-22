class CreatePlaylists < ActiveRecord::Migration
  def change
    create_table :playlists do |t|
      t.string :username
      t.text :playlistsJSON

      t.timestamps
    end
  end
end
