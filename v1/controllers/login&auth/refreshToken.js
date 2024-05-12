const jwt = require("jsonwebtoken");

const { getData } = require("../../helpers/getData");
const { model } = require("../../model/mainModel");

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ message: `Failed because no cookie` });
  const refreshToken = cookies.jwt;

  // find user with refresh token in users table in database

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ message: `Failed from verifing refresh token` });
      try {
        const tokenUser = {
          username: decoded.username,
          img: decoded.img,
        };
        let Results = [];
        if (model["Users"]) {
          Results = model["Users"].filter(
            (user) => user.UserName === decoded.username
          );
        } else {
          var query = `SELECT TOP 1 * FROM Users WHERE UserName = '${decoded.username}'`;
          getData(query).then((result) => {
            Results = result.recordsets[0];
          });
        }
        // const allUsers = await getAllData("AdminUsersApp");
        const user = {
          username: decoded.username,
          email: Results[0]["Email"],
          roles: Results[0]["Role"],
          img: decoded.img,
        };

        const token = jwt.sign(tokenUser, process.env.TOKEN_SECRET_KEY, {
          expiresIn: "1h",
        });
        return res.status(200).json({ token: token, user: user });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  );
};

module.exports = { handleRefreshToken };
