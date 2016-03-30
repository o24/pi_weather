var log = (function() {
  if (window.console && console.log) {
    return console.log.bind(console);
  }
  else {
    return function() {
      var text = Array.prototype.join.apply(arguments, [', ']);
      alert(text);
    }
  }
})();
var Log = function() { };

Log.color = function(message, color) {
  var style = `color:${color};`
  console.log(`%c${message}` , style);
}
Log.red = function(message) {
  this.color(message, "red");
}
Log.green = function(message) {
  this.color(message, "green");
}
Log.blue = function(message) {
  this.color(message, "blue");
}
Log.d = function(message) {
  console.debug(message);
}
Log.w = function(message) {
  console.warn(message);
}
Log.i = function(message) {
  console.info(message);
}
Log.e = function(message) {
  console.error(message);
}
