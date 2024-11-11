const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

module.exports = async function isAuthenticated(req, res, next) {
  try {
    if (!req.headers["authorization"]) {
      return res.json({ message: "Please provide jwt token" });
    }
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, "HELLO", (err, user) => {
      if (err) {
        return res.json({ message: err });
      } else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log("error on middleware", error);
  }
};
