const crypto = require("crypto");

const generatePasswordResetToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

module.exports = generatePasswordResetToken;
