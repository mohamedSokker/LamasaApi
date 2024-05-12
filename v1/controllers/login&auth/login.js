const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { getData } = require("../../helpers/getData");
const { model } = require("../../model/mainModel");

const loginapp = async (req, res) => {
  try {
    const { username, password } = req.body;

    let SearchedItems;
    if (model["Users"]) {
      SearchedItems = model["Users"].find((user) => user.UserName === username);
    } else {
      var query = `SELECT TOP 1 * FROM Users WHERE UserName = '${username}'`;
      getData(query).then((result) => {
        SearchedItems = result.recordsets[0][0];
      });
    }

    if (!SearchedItems)
      return res.status(401).json({ message: `No Found Username in DB` });
    bcrypt.compare(password, SearchedItems["Password"], async (err, result) => {
      if (err) return res.status(401).json({ message: err.message });
      if (!result)
        return res.status(401).json({ message: `Password Didn't Match` });
      const Tokenuser = {
        username: username,
        img: SearchedItems["ProfileImg"],
      };
      const user = {
        id: SearchedItems["ID"],
        username: username,
        email: SearchedItems["Email"],
        roles: SearchedItems["Role"],
      };

      const token = jwt.sign(Tokenuser, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        Tokenuser,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "5000000d",
        }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 5000000 * 24 * 60 * 60 * 100,
        path: "/",
        secure: true,
        sameSite: "None",
      });
      return res.status(200).json({ token: token, user: user });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = loginapp;
