class CardsController < ApplicationController
  before_action :set_card, only: [:show, :destroy]
  require "payjp"

  def new
    card = Card.where(user_id: current_user.id)
    redirect_to card_path(current_user.id) if card.exists?
  end

  def create #payjpとCardのデータベース作成
    Payjp.api_key = Rails.application.credentials[:payjp][:PAYJP_PRIVATE_KEY]
    #保管した顧客IDでpayjpから情報取得
    if params['payjp-token'].blank?
      redirect_to new_card_path
    else
      customer = Payjp::Customer.create(
        card: params['payjp-token'],
        metadata: {user_id: current_user.id}
      ) 
      @card = Card.new(user_id: current_user.id, customer_id: customer.id, card_id: customer.default_card)
      if @card.save
        flash[:notice] = 'クレジットカードの登録が完了しました'
        redirect_to root_path
      else
        flash[:alert] = 'クレジットカード登録に失敗しました'
        render :new
      end
    end
  end


  def destroy #PayjpとCardデータベースを削除
    if @card.blank?
    else
      Payjp.api_key = Rails.application.credentials[:payjp][:PAYJP_PRIVATE_KEY]
      customer = Payjp::Customer.retrieve(@card.customer_id)
      customer.delete
      @card.delete
    end
      redirect_to new_card_path
  end

  def show #Cardのデータpayjpに送り情報を取り出す
    if @card.blank?
      redirect_to new_card_path 
    else
      Payjp.api_key = Rails.application.credentials[:payjp][:PAYJP_PRIVATE_KEY]
      customer = Payjp::Customer.retrieve(@card.customer_id)
      @default_card_information = customer.cards.retrieve(@card.card_id)
    end
  end

  private

    def set_card
      @card = Card.find_by(user_id: current_user.id)
    end
end
