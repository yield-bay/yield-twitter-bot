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

module.exports = {
  formatFloat,
  toDollar,
};
