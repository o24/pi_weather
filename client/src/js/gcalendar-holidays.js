/**
 * The MIT License
 * 
 * Copyright (c) 2007-2016 dgbadmin@gmail.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

/**
 *  GCalendar Holidays - Googleカレンダーから日本の祝日を取得
 *  @see       http://0-oo.net/sbox/javascript/google-calendar-holidays
 *  @version   0.6.0
 *  @copyright 2008-2014 dgbadmin@gmail.com
 *  @license   http://0-oo.net/pryn/MIT_license.txt (The MIT license)
 */
var GCalHolidays = {
    /** Google Calendarから情報を取得するAPIのURL */
    apiUrl: "https://gcalendar-holidays.appspot.com/",

    /** jQuery UI Datepicker用のstyle（Themeに合わせてお好みで上書きして使う） */
    datepickerStyles: {
        sunday:   "background-image: none; background-color: #f99", //日曜日
        saturday: "background-image: none; background-color: #6cf", //土曜日
        holiday:  "background-image: none; background-color: #f9f"  //祝日
    }
};
/**
 *  祝日を取得する
 *  @param  Function    callback    データ取得時に呼び出されるfunction
 *  @param  Number      year        (optional) 年（指定しなければ今年）
 *  @param  Number      month       (optional) 月（1～12 指定しなければ1年の全て）
 */
GCalHolidays.get = function(callback, year, month) {
    //日付範囲
    var padZero = function(value) { return ("0" + value).slice(-2); };
    var y = year || new Date().getFullYear();
    var start = [y, padZero(month || 1), "01"].join("-");
    var m = month || 12;
    var end = [y, padZero(m), padZero(new Date(y, m, 0).getDate())].join("-");

    this._caches = (this._caches || {});
    this._userCallback = callback;

    var cache = this._caches[start + ".." + end];

    if (cache) {    //取得済みの場合はそれを使う
        callback(cache, 0);
        return;
    }

    //URL作成
    var url = GCalHolidays.apiUrl + "?timeMin=" + start + "&timeMax=" + end;

    //scriptタグ生成
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.charset = "UTF-8";
    document.body.appendChild(script);
};
/**
 *  JSONPによりGoogle Calendar API経由で呼び出されるfunction
 *  @param  Object  gdata   カレンダーデータ
 *  @param  String  start   開始日付
 *  @param  String  end     終了日付
 */
GCalHolidays.decode = function(gdata, start, end) {
    var days = GCalHolidays._entries2days(gdata.items);

    //キャッシュする
    this._caches[start + ".." + end] = days;

    //コールバック
    this._userCallback(days, 0);    // 第2引数は過去バージョンの遺産
};
/**
 *  JSONPで取得したデータから日付情報を取り出す
 *  @param  Array   entries スケジュール
 *  @return Array   日付情報（year, month, date, title）
 */
GCalHolidays._entries2days = function(entries) {
    var days = [];
    var cnt = 0;

    if (!entries) {
        return days;
    }

    //シンプルな器に移す
    for (var i = 0, len = entries.length; i < len; i++) {
        var entry = entries[i];
        var ymd = entry.start.date.split("T")[0].split("-");

        days[cnt] = { //年月日は使いやすいように数値にする
            year: ymd[0] * 1,
            month: ymd[1] * 1,
            date: ymd[2] * 1,
            title: entry.summary
        };
        cnt++;
    }

    return days;
};

/**
 *  jQuery UI Datepickerのカレンダーに祝日を表示する
 *  @param  Number  year    表示する年
 *  @param  Number  month   表示する月
 *  @param  Object  inst    Datepicker
 *  @see http://jqueryui.com/demos/datepicker/
 */
GCalHolidays.datepicker = function(year, month, inst) {
    setTimeout(function() { //処理後に対象のdivが再構築されるケースを回避
        for (var i = 0, len = (inst.settings.numberOfMonths || 1); i < len; i++) {
            GCalHolidays.get(function(holidays) {
                for (var j = 0, len2 = holidays.length; j < len2; j++) {
                    var h = holidays[j];
                    var s = "[data-year=" + h.year + "][data-month=" + (h.month - 1) + "] a"

                    inst.dpDiv.find(s).each(function() {
                        if ($(this).text() == h.date) {
                            $(this).addClass("gcal-holiday").attr("title", h.title);
                            return false;
                        }
                    });
                }
            }, year, month);
            
            month++;
            
            if (month > 12) {
                year++;
                month = 1;
            }
        }
    }, 1);
};
/**
 *  jQuery UI Datepickerが有効な場合はイベントハンドラとstyleをセットする
 */
if (window.$ && $.datepicker && $.datepicker.setDefaults) {
    $.datepicker.setDefaults({
        beforeShow: function(input, inst) {
            var date = $(input).datepicker("getDate") || new Date();
            GCalHolidays.datepicker(date.getFullYear(), date.getMonth() + 1, inst);
        },
        beforeShowDay: function(date) { //土日のclass属性
            return [true, { 0: "gcal-sunday", 6: "gcal-saturday" }[date.getDay()] || ""];
        },
        onChangeMonthYear: GCalHolidays.datepicker
    });

    $(function() {  //ページ表示後に土日・祝日用のstyleをセット
        var styles = GCalHolidays.datepickerStyles;
        var css = "";
        css += ".gcal-sunday   .ui-state-default { " + styles.sunday + " } ";
        css += ".gcal-saturday .ui-state-default { " + styles.saturday + " } ";
        css += ".ui-widget-content .gcal-holiday { " + styles.holiday + " }";
        $("head").append($('<style type="text/css">' + css + "</style>"));
    });
}
