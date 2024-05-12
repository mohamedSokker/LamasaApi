const jwt = require("jsonwebtoken");
// const { getData } = require("../../../v3/helpers/getData");

const logout = (req, res) => {
  // in client: delete access token

  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(204).json({ message: `cookies already erased` });
  const refreshToken = cookies.jwt;

  //check if this refreshToken is in the database

  //update refreshToken to null

  res.clearCookie("jwt", {
    httpOnly: true,
    maxAge: 5000000 * 24 * 60 * 60 * 100,
    path: "/",
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: `Successfully Cleared Cookie` });
};

module.exports = { logout };
