# pi_weather
Paspberry Pi(pi) + LCDディスプレイで 天気予報付き置き時計を作る
詳しくは以下の記事をご覧ください
[LCDディスプレイを取り付けて天気予報付き置き時計にする](http://blog.o24.me/?p=749)

## ディレクトリ構成
* clientディレクトリ
pi上で表示させるhtmlです。

* scriptディレクトリ
yahoo天気から気象情報を取得するスクリプトです。
cronで定期的に取得しましょう

## セットアップ方法

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

### 2. html設定
piの組み立てや、kioskでのフルスクリーンなどの設定方法は以下を参考に
[LCDディスプレイを取り付けて天気予報付き置き時計にする](http://blog.o24.me/?p=749)

html一式は`client/src`配下全てです。
こちらをapacheのdocument_rootへ設定してください。
