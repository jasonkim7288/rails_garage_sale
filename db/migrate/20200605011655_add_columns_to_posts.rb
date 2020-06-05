class AddColumnsToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :latitude, :decimal, default: -27.4698
    add_column :posts, :longitude, :decimal, default: 153.0251
  end
end
