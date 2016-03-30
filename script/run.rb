#!/usr/bin/env ruby
# coding: utf-8

require 'rubygems'
require 'json'
require 'pry'
require 'pry-byebug'
require 'nokogiri'
require 'open-uri'

require './config'
# gem install nokogiri pry pry-byebug

# Yahoo天気から気性情報を取得
def parseHtml()
  url = "http://weather.yahoo.co.jp/weather/jp/#{AREA_ID}/#{ZONE_ID}.html"
  page = open(url)
  html = Nokogiri::HTML(page.read, nil, 'utf-8')
  body = html.css("#main > div.forecastCity > table  tr > td:nth-child(1) > div")
  icon_node = body.css(".pict img")

  state_node = body.css(".pict")

  temp_parent = body.css(".temp")

  percent_list = body.css(".precip td")

  # 降水確率 [0-6, 6-12, 12-18, 18-24]
  forecast_list = body.css(".precip td").map do |node|
    node.text
  end

  icon = icon_node.attr("src").value
  max = temp_parent.css(".high").text
  min = temp_parent.css(".low").text
  state = state_node.text

  json_data = {
    max: max,
    min: min,
    state: state,
    icon: icon,
    forecast: forecast_list,
  }

  json_path = File.join(JSON_DIR, "temp.json")

  open(json_path, 'w') do |io|
    JSON.dump(json_data, io)
  end
end

parseHtml()
