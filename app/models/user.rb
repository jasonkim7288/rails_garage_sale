class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:facebook, :github, :google_oauth2],
         authentication_keys: [:full_name]
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  validates :email, uniqueness: true
  
  def self.create_from_provider_data(provider_data)
    where(provider: provider_data.provider, uid: provider_data.uid).first_or_create do |user|
      user.email = provider_data.info.email
      user.password = Devise.friendly_token[0, 20]
      case provider_data.provider
      when "facebook"
        user.full_name = provider_data.info.name ? provider_data.info.name : provider_data.info.email
      when "google_oauth2"
        user.full_name = provider_data.info.name
      when "github"
        user.full_name = provider_data.info.name ? provider_data.info.name : provider_data.info.nickname
      else
        user.full_name = user.email
      end
    end
  end   
end
