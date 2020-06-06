class ChangeLatitudeInPosts < ActiveRecord::Migration[6.0]
  def change
    change_column :posts, :latitude, :decimal
    change_column :posts, :longitude, :decimal
  end
end
