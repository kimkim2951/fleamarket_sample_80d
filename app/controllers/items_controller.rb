class ItemsController < ApplicationController
  before_action :set_item, only: [:show, :edit, :update]

  def index
    @items = Item.all.order('id DESC').limit(5)##.orderはアクティブレコードClassに割り当てられている。メソッドで並び順を決めている。例えばuserIDで並び替えたい場合は('user_id DESC')
  end

  def new
    @item = Item.new
    @item.item_imgs.new##@itemに紐づいた.item_imgsの空のインスタンスを生成している。画像を選択できるアイテムが１個増えた。
    @category = Category.where(ancestry: "").limit(13)##Category.whereから(ancestry: "")を探してくる記述、ancestry: ""はアンセストリーの親である、テーブルを見るとわかるよ！親のancestry:カラムはnullになっている。その子のancestry:カラムは1。子の子のancestry:カラムは1/2。（つまり1/2 = 親の親の主キー/親の主キー）
  end

  def get_category_children  
    @category_children = Category.find(params[:parent_id]).children ##[:parent_id]はアンセストリーの一番親＝Nillのキー　##ajax通信でparent_id: parent_category_idが送られてくる。.childrenはアンセストリーのメソッド、Category.find(params[:parent_id])まず、レディースのIDのみを取得する、アンセストリーにしているので.childrenで紐づいたIDを全て連れてくる。
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
    @grandchild = @item.category##@item.categorryは孫のIDが挿入されている。なぜかは７７行目を確認。
    @child = @grandchild.parent#孫の親を指している。
    @parent = @child.parent##子の親を指している。孫視点で見ると親の親。
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
    :shipping_date, :category_id, :brand,##:category_id,は孫のIDである、フォームのname属性の[category_id]は親、孫、子、全て同じname属性で記述しているため、フォームを開いてJSで追加するたびに上書きされている。よって３個開いた前提で孫のIDが挿入されている状態と考える。
    item_imgs_attributes: [:image, :_destroy, :id]).merge(:user_id => current_user.id)##[:image, :_destroy, :id]は画像が複数枚投稿される実装なので、一つ一つの画像にこのキーを持たせて保存する必要があるのでこのように書く。＝item_imgs_attributes:はこの様に書くと深掘りするな！
  end

  def set_item
    @item = Item.includes(:item_imgs).find(params[:id])##[:id]はItemの主キー
  end
end