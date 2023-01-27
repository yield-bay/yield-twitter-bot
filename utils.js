function formatFloat(value) {
  return parseFloat(value).toFixed(2);
}

function toDollar(num) {
  if (num >= 1000000) {
    return "$" + (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000 && num < 1000000) {
    return "$" + (num / 1000).toFixed(2) + "K";
  }
  return "$" + num.toString();
}

function getToday() {
  var today = new Date();
  var dd = today.getDate();
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let mm = month[today.getMonth()];
  return dd + " " + mm;
}

module.exports = {
  formatFloat,
  toDollar,
  getToday,
};
