const express = require("express");
const app = express();

const User = require("./user.js");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT_AUTH;

const jwt = require("jsonwebtoken");

app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("Auth-Service is connected");
  });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: 'User dosen"t exist' });
  } else {
    if (password !== user.password) {
      return res.json({ message: "Invalid credentials" });
    }
    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, process.env.SECRET, (err, token) => {
      if (err) console.log(err);
      else {
        return res.json({ token: token });
      }
    });
  }
});

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already Exists." });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save();
    return res.json(newUser);
  }
});

app.listen(PORT, () => {
  console.log(`Auth-Service is running on ${PORT}`);
});
