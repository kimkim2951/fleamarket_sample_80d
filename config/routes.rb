Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations',
  }
  devise_scope :user do
    get 'addresses', to: 'users/registrations#new_address'
    post 'addresses', to: 'users/registrations#create_address'
  end
  
  root 'items#index'

  resources :cards, only: [:new, :show, :create, :destroy] do

    resources :items do
      # resources :comments 準備のみ
      #Ajaxで動くアクションのルートを作成
      collection do
        post 'pay', to: 'cards#pay'
      end
    end
  end

  resources :items
    #Ajaxで動くアクションのルートを作成
  resources :items, only: [:new, :show, :create, :edit, :update, :destroy] do

    collection do
      get 'category/get_category_children', to: 'items#get_category_children', defaults: { format: 'json' }
      get 'category/get_category_grandchildren', to: 'items#get_category_grandchildren', defaults: { format: 'json' }
    end
    
    resources :buyers, only: [:index] do
      collection do
        get 'done', to: 'buyers#done'
        post 'pay', to: 'buyers#pay'
      end
    end
  end

  resources :users, only: [:show]
end
