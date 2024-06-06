const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const express = require("express");
const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs", { redirect: req.query });
});

router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.post("/sign-up", async (req, res) => {
  const userInDb = await User.findOne({ username: req.body.username });
  if (userInDb) {
    return res.send("Username already taken");
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and confirm password must match");
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);

  req.session.user = {
    username: user.username,
  };

  req.session.save(() => {
    res.redirect("/");
  });
});

router.post("/sign-in", async (req, res) => {
  const userInDb = await User.findOne({ username: req.body.username });
  if (!userInDb) {
    return res.send("Login failed. Please try again.");
  }
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDb.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }
  req.session.user = {
    username: userInDb.username,
  };
  req.session.save(() => {
    console.log(req);
    console.log(req.originalUrl);
    if (req.query.redirectUrl) {
      res.redirect(req.query.redirectUrl);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
