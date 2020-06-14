Rails.application.routes.draw do
  
  get 'posts/myposts'
  delete 'posts/admindelete'
  resources :posts
  root 'posts#index'
  devise_for :users, controllers: {omniauth_callbacks: 'omniauth'}
  get 'pages/privacy_policy'


  resources :posts do
    resources :comments
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
