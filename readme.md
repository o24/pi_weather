# pi_weather
このリポジトリはPaspberry Pi(pi) + LCDディスプレイで 天気予報付き置き時計を作るための、気象情報取得と、表示用htmlが入っています。

詳しくは以下の記事をご覧ください
[LCDディスプレイを取り付けて天気予報付き置き時計にする](http://blog.o24.me/?p=749)

## ディレクトリ構成
* client
pi上で表示させるhtmlです。

* script
yahoo天気から気象情報を取得するスクリプトです。
Yahooに迷惑をかけないよう、ほどほどなスパンで取得しましょう。

## システム構成
以下が必要になります。
入ってない方はインストールしてください。

* ruby (検証バージョン:ruby 2.1.5p273)

* git

* apache2

## セットアップ
必要最低限のセットアップを記載します。
既にapacheが動いている方など環境によってはカスタマイズが必要な場合もあります。

### リポジトリclone


### rubyインストール

### 1. 気象情報
本スクリプトはrubyを使用しています。
rubyのインストールは各自調べて下さい。

* gem install
```
gem install nokogiri pry pry-byebug
```

* エリアの設定
```
cd script

# 設定ファイル修正
# 初期は広島の気象情報になっていますので各自修正してください。
vi config.rb
```

* cron登録
```
crontab -e

# cronでrubyを実行する場合は、書き方に癖があるので注意
5 * * * * cd /DIR/pi_weather; /root/.rbenv/shims/ruby /DIR/pi_weather/script/run.rb > /dev/null
```

### 2. html(apache)設定
以前はparse.comへhtmlと気象情報を置いていましたが、parse.comが2017年にサービス終了するので、
pi単体で動くようにしました。
複数のpiで表示させたい場合は、S3やレンタルサーバーへ置いてもいいと思います。

html一式は`client/src`配下全てです。
こちらをapacheのdocument_rootへ設定してください。


* リポジトリclone
```
cd /
mkdir /git
cd git
git clone
```

* apacheインストール
```
apt-get update
apt-get upgrade

apt-get install apache2

```

* apache自動起動
```
cd /etc/rc2.d
mv S02apache2 S20apache2
```

* apache設定

```
vi /etc/apache2/apache2.conf

```

```
# 以下追記
DocumentRoot "/var/www"
<Directory "/var/www">
    Options FollowSymLinks
</Directory>

```

```
# apache 再起動
/etc/init.d/apache2 restart
```

### 3. LCDディスプレイ、フルスクリーン化の設定
piの組み立てや、kioskでのフルスクリーンなどの設定方法は以下を参考に
[LCDディスプレイを取り付けて天気予報付き置き時計にする](http://blog.o24.me/?p=749)
