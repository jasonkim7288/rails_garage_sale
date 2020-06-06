class PhoneNumberValidator < ActiveModel::Validator
  def validate(record)
    if record.phone != "" && TelephoneNumber.invalid?(record.phone, :AU, [:mobile, :fixed_line])
      record.errors[:phone] << 'number has an invalid format'
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
  validates_with PhoneNumberValidator

  def direction_url
    return "https://www.google.com/maps/dir/?api=1&destination=#{self.address.gsub(/ /, "+").gsub(/,/, "%2C")}"
  end

end
