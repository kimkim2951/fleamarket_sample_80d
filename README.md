# README
<h1 align="center">フリーマーケットサイト</h1>

- メルカリクローンのフリーマーケットサイトです。
- 
- 作成期間 2020/8/4 ~ 2020/8/27
 <a>![top_page](https://user-images.githubusercontent.com/67991805/91381190-bbe46280-e861-11ea-962c-6d6f920fdad8.gif)</a>

## :paperclip: 主な使用言語
<a><img src="https://user-images.githubusercontent.com/39142850/71774533-1ddf1780-2fb4-11ea-8560-753bed352838.png" width="70px;" /></a> <!-- rubyのロゴ -->
<a><img src="https://user-images.githubusercontent.com/39142850/71774548-731b2900-2fb4-11ea-99ba-565546c5acb4.png" height="60px;" /></a> <!-- RubyOnRailsのロゴ -->
<a><img src="https://user-images.githubusercontent.com/39142850/71774618-b32edb80-2fb5-11ea-9050-d5929a49e9a5.png" height="60px;" /></a> <!-- Hamlのロゴ -->
<a><img src="https://user-images.githubusercontent.com/39142850/71774644-115bbe80-2fb6-11ea-822c-568eabde5228.png" height="60px" /></a> <!-- Scssのロゴ -->
<a><img src="https://user-images.githubusercontent.com/39142850/71774768-d064a980-2fb7-11ea-88ad-4562c59470ae.png" height="65px;" /></a> <!-- jQueryのロゴ -->
<a><img src="https://user-images.githubusercontent.com/39142850/71774786-37825e00-2fb8-11ea-8b90-bd652a58f1ad.png" height="60px;" /></a> <!-- AWSのロゴ -->

## 機能紹介
- 新規会員登録・ログインをすると商品の購入、出品が出来ます。
- 新規会員登録、ログインをしていない方でも商品の一覧、詳細を閲覧出来ます。
- 決済方法はご自身のクレジットカードを登録して購入出来ます。
- ※個人情報につきテストコードにて運用中

## メンバー&実装内容の紹介
### 飯田正也
- スクラムマスター
- 商品詳細ページ（ビュー）
- 商品詳細ページ（サーバーサイド）

### 加藤義人
- デプロイ担当、AWS EC2~S3導入
- ユーザー新規登録、ログイン（ビュー）
- ユーザー新規登録、ログイン（サーバーサイド）
- 商品情報編集（サーバーサイド）

### 木村幸樹
- 商品購入確認ページ（ビュー）
- 商品カテゴリー機能（サーバーサイド）
- 商品出品機能（サーバーサイド）

### 児玉亮太
- 商品出品ページ（ビュー）
- 商品購入機能（サーバーサイド）
- 商品削除機能(サーバーサイド)

### 山内聡
- トップページ（ビュー）
- ユーザーマイページ（ビュー）
- 商品一覧表示（サーバーサイド）

## サイトURL紹介
- IPアドレス:http://3.115.242.70/
### BASIC認証
- 【ID】katopu
- 【Pass】katokato1234
### クレジットカード情報(テストコード)
- 番号：4242424242424242
- 期限：03/23
- セキュリティカード：123


# :page_facing_up: DB設計

## ER図
<a><img width="1243" alt="dcc22b7560b21da7ca07f680e33591c7" src="https://user-images.githubusercontent.com/67991805/90978720-d5985800-e58a-11ea-8139-6a530d14806f.png"></a>


## usersテーブル

|Column|Type|Options|
|------|----|-------|
|nick_name|string|null: false, unique: true|
|email|string|null: false, unique: true|
|password|string|null: false|
|birth_day|date|null: false|

### Association
- has_many :items
- has_many :comments
- has_many :likes
- has_one :addresses
- has_one :credit_card

## Itemsテーブル

|Column|Type|Options|
|------|----|-------|
|user_id|references|null: false, foreign_key: true|
|category|references|null: false, foreign_key: true|
|brand|string||
|name|string|null: false, index: true|
|price|integer|null: false|
|explain|text|null: false|
|status|integer|null: false|
|postage|integer|null: false|
|prefecture|integer|null: false|
|shipping_date|integer|null: false|
|sale_status|integer|default: ""|
### Association
- has_many :likes
- has_many :comments
- has_many :item_imgs
- belongs_to :user
- belongs_to :category

## Commentsテーブル

|Column|Type|Options|
|------|----|-------|
|user|references|null: false, foreign_key: true|
|item|references|null: false, foreign_key: true|
|comment|text|null: false|
### Association
- belongs_to :user
- belongs_to :item

## Categoriesテーブル]

|Column|Type|Options|
|------|----|-------|
|category|string|null: false|
|ancestry|string| |
### Association
- has_many :items

## Likesテーブル

|Column|Type|Options|
|------|----|-------|
|user|references|null: false, foreign_key: true|
|item|references|null: false, foreign_key: true|
### Association
- belongs_to :user
- belongs_to :item


## Credit_cardsテーブル

|Column|Type|Options|
|------|----|-------|
|user_id|references|null: false, foreign_key: true|
|customer_id|string|null: false|
|card_id|string|null: false|
### Association
- belongs_to :user

## Addressesテーブル

|Column|Type|Options|
|------|----|-------|
|user_id|references|null: false, foreign_key: true|
|first_name|string|null: false|
|last_name|string|null: false|
|first_name_kana|string|null: false|
|last_name_kana|string|null: false|
|phone_no|string| |
|postal_code|string|null: false|
|prefecture|string|null: false|
|city|string|null: false|
|address|string|null: false|
|apartment|string| |
### Association
- belongs_to :user

## Item_imgsテーブル

|Column|Type|Options|
|------|----|-------|
|item|references|null: false, foreign_key:true|
|image|string|null: false|
### Association
- belongs_to :item