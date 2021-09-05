const { format } = require("timeago.js");
const helpers = {};
helpers.timeago = function (Fecha) {
  console.log(Fecha);
  return format(Fecha);
};

module.exports = helpers;
