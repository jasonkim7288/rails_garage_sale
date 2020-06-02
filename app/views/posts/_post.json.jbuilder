json.extract! post, :id, :title, :address, :open_date, :close_date, :user_id, :created_at, :updated_at
json.url post_url(post, format: :json)
