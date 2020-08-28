# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  def create
    @user = User.new(sign_up_params)##※deviseのデフォルトのパラムス(application_controllerで定義しているconfigure_permitted_parametersの事であるぞ）、デフォルト以外の入力させたい情報を空のインスタンスへ追加している。
    unless @user.valid?##ユーザー新規登録（アドレス登録前）のバリデーションに掛からず、次のアドレス登録に遷移出来る状態か判別している。
      flash.now[:alert] = @user.errors.full_messages##※valid?で@userに空の状態で元々あるerrorsメソッドへエラーメッセージの値を入れている。
      render :new and return
    end
    session["devise.regist_data"] = {user: @user.attributes}##attributesとは@user（インスタンス変数）をuser:とのキーバリューの関係にするメソッド
    session["devise.regist_data"][:user]["password"] = params[:user][:password]##ここでbinding.pryで情報を確認してみよう！！パスワードをsessionに渡している。@userにはパスワードの情報がない、パスワードはデータベースに保存するものではないため、本来は弾かれてしまう。{session: {["devise.regist_data"]: @user}}こんな感じ
    @address = @user.build_address## @user.address.newの形、@userは上で定義した情報（パスワードはない）が入っている、addressというからの入れ物をくっつけて（アドレス情報入力用）@addressのインスタンス変数に渡している。
    render :new_address
  end
  

  def create_address
    @user = User.new(session["devise.regist_data"]["user"])## 画面が遷移してもデータを引き継げる様にしている。
    @address = Address.new(address_params)
    unless @address.valid?
      flash.now[:alert] = @address.errors.full_messages
      render :new_address and return
    end
    @user.build_address(@address.attributes)
    @user.save
    session["devise.regist_data"]["user"].clear
    sign_in(:user, @user)
    redirect_to root_path, notice: 'ログインしました'##各行でbinding.pryやコメントアウトなどをしてみよう！
  end

  protected

  def address_params
    params.require(:address).permit(:first_name, :last_name, :first_name_kana, :last_name_kana, :phone_no, :postal_code, :prefecture, :city, :address, :apartment)
  end
  # POST /resource
  # def create
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
