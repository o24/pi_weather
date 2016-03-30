
# Yahoo天気から気象情報を拝借する
# Yahooに負担をかけないよう、アクセスはほどほどにしましょう
#
# http://weather.yahoo.co.jp/weather/jp/<AREA_ID>/<ZONE_ID>.html
#
# (例) 広島県 / 南部(広島)
# http://weather.yahoo.co.jp/weather/jp/34/6710.html
# AREA_ID = "34"
# ZONE_ID = "6710"

# 都道府県
AREA_ID = "34"
# 北部、南部など
ZONE_ID = "6710"

# json保存先
#JSON_DIR = File.absolute_path("../client/src/json")
JSON_DIR = "../client/src/json"
