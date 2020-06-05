class Post < ApplicationRecord
  belongs_to :user
  has_rich_text :body

  def direction_url
    return "https://www.google.com/maps/dir/?api=1&destination=#{self.address.gsub(/ /, "+").gsub(/,/, "%2C")}"
  end

end
