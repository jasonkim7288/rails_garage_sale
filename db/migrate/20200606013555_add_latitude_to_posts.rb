class AddLatitudeToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :latitude, :decimal
    add_column :posts, :longitude, :decimal
  end
end
