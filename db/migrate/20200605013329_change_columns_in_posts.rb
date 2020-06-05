class ChangeColumnsInPosts < ActiveRecord::Migration[6.0]
  def change
    change_column :posts, :title, :string, null: false
    change_column :posts, :address, :string, null: false
    change_column :posts, :open_date, :datetime, null: false
    change_column :posts, :close_date, :datetime, null: false
  end
end
