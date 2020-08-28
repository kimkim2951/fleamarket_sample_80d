class ItemsController < ApplicationController
  before_action :set_item, only: [:show, :edit, :update]

  def index
    @items = Item.all.order('id DESC').limit(5)
  end

  def new
    @item = Item.new
    @item.item_imgs.new
    @category = Category.where(ancestry: "").limit(13)
  end

  def get_category_children  
    @category_children = Category.find(params[:parent_id]).children 
    end

  def get_category_grandchildren
    @category_grandchildren = Category.find(params[:child_id]).children
    end

  def create
    @item = Item.new(item_params) 
    if @item.save
      redirect_to root_path
    else
      @item.item_imgs.new
      @grandchild = @item.category
      @child = @grandchild.parent
      @parent = @child.parent
      render :new
    end
  end

  def show
    # @comment = Comment.new 準備のみ
    # @comments = @item.comments.includes(:user) 準備のみ
    @grandchild = @item.category
    @child = @grandchild.parent
    @parent = @child.parent
  end


  def edit
    @item.item_imgs.new
    @grandchild = @item.category
    @child = @grandchild.parent
    @parent = @child.parent
  end

  def update
    if @item.update(item_params)
      redirect_to root_path
    else
      @grandchild = @item.category
      @child = @grandchild.parent
      @parent = @child.parent
      render :edit
    end
  end

  def destroy
    @item = Item.find(params[:id])
    if @item.destroy.user_id == current_user.id && @item.destroy
      redirect_to root_path, notice: "削除が完了しました"
    else
      render action: :show, alert: "削除が失敗しました"
    end
  end

  private

  def item_params
    params.require(:item).permit(
    :name, :explain, :price, :status, 
    :postage, :prefecture,
    :shipping_date, :category_id, :brand,
    item_imgs_attributes: [:image, :_destroy, :id]).merge(:user_id => current_user.id)
  end

  def set_item
    @item = Item.includes(:item_imgs).find(params[:id])
  end
end