class CustomValidator < ActiveModel::Validator
  def validate(record)
    p record
    if record.phone != "" && TelephoneNumber.invalid?(record.phone, :AU, [:mobile, :fixed_line])
      record.errors[:phone] << 'number has an invalid format'
    end
    if record.latitude == nil || record.latitude == "" || record.longitude == nil || record.longitude == ""
      record.errors[:address] << 'has an invalid format'
    end
  end
end

class Post < ApplicationRecord
  belongs_to :user
  has_rich_text :body

  validates :title, presence: true
  validates :address, presence: true
  validates :open_date, presence: true
  validates :close_date, presence: true
  include ActiveModel::Validations
  validates_with CustomValidator

  def direction_url
    return "https://www.google.com/maps/dir/?api=1&destination=#{self.address.gsub(/ /, "+").gsub(/,/, "%2C")}"
  end

  def place_url
    return "https://www.google.com/maps/search/?api=1&query=#{self.address.gsub(/ /, "+").gsub(/,/, "%2C")}"
  end

  # If open date is equal to close date, return only open date
  def period_without_year
    open_date = self.open_date.to_time.strftime("%e %B")
    close_date = self.close_date.to_time.strftime("%e %B")
    return open_date == close_date ? open_date : "#{open_date} ~ #{close_date}"
  end

  # If open date is equal to close date, return only open date with year
  def period_with_year
    open_date = self.open_date.to_time.strftime("%e %B %Y")
    close_date = self.close_date.to_time.strftime("%e %B %Y")
    return open_date == close_date ? open_date : "#{open_date} ~ #{close_date}"
  end

end
