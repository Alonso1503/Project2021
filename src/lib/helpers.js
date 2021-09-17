const bcrypt = require("bcryptjs");
const helpers = {};

helpers.encryptPassword = async (clave) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(clave, salt);
  return hash;
};

helpers.matchPassword = async (clave, claveGuardada) => {
  try {
    return await bcrypt.compare(clave, claveGuardada);
  } catch (e) {
    console.log(e);
  }
};

module.exports = helpers;
