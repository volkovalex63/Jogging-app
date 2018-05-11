// Date.prototype.getWeek = function () {
//     var target  = new Date(this.valueOf());
//     var dayNr   = (this.getDay() + 6) % 7;
//     target.setDate(target.getDate() - dayNr + 3);
//     var firstThursday = target.valueOf();
//     target.setMonth(0, 1);
//     if (target.getDay() != 4) {
//         target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
//     }
//     return 1 + Math.ceil((firstThursday - target) / 604800000);
// }
Date.prototype.getWeekOfMonth = function() {
  var firstWeekday = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
  var offsetDate = this.getDate() + firstWeekday - 1;
  return Math.floor(offsetDate / 7);
}

function formatDate(d) {

    month = '' + (d.getUTCMonth() + 1),
    day = '' + d.getUTCDate(),
    year = d.getUTCFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function getMonthWeek(now){
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    return Math.ceil((now.getDate() + firstDay)/7);
}
