Rails.application.routes.draw do
  resources :items
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  
  resources :buyers, only: :index do
    collection do
      get 'index', to: 'buyers#index'
      post 'pay', to: 'buyers#pay'
      get 'done', to: 'buyers#done'
    end
  end
  root 'items#index'
end
