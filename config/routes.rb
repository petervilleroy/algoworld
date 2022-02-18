Rails.application.routes.draw do
 
  resources :sessions, only: [:new, :create, :destroy]
  resources :useractions, only: [:create, :index, :show]

  
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'

  resources :users
  get 'page/index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "level1#lvl1"
  get 'lvl1' => 'level1#lvl1'
  get 'lvl2' => 'level2#lvl2'
  get 'lvl3' => 'level3#lvl3'

end
