const handleRefreshToken = require("../../routes/login&auth/refreshToken");
const loginapp = require("../../routes/login&auth/login");
const handleLogout = require("../../routes/login&auth/logout");

const authEndPoints = (app) => {
  app.use("/refresh", handleRefreshToken);
  app.use("/handleLoginApp", loginapp);
  app.use("/logout", handleLogout);
};

module.exports = { authEndPoints };
