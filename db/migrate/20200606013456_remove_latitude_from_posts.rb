class RemoveLatitudeFromPosts < ActiveRecord::Migration[6.0]
  def change
    remove_column :posts, :latitude, :string
    remove_column :posts, :longitude, :string
  end
end
