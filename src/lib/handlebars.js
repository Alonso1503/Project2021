const { format } = require("timeago.js");
const helpers = {};
helpers.timeago = function (Fecha) {
  return format(Fecha);
};

module.exports = helpers;
