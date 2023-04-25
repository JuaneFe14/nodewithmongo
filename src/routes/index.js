//const { Router } = require('express');
//const Router = require('express');
const express = require("express");
const router = express.Router(); // El mismo manejo de rutas pero con el método Router de express
const Task = require("../models/tasks");
const User = require("../models/users");

let userAuth = false;

let users;
let tasks;

router.get("/", async (req, res) => {
  if (userAuth) {
    tasks = await Task.find();

    res.render("index", {
      tasks,
    });
  } else {
    users = await User.find();
    if (users && users.length > 0) {
      res.render("login", { users });
    } else {
      res.render("register", { users });
    }
  }
});

router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;

  const auth = User.findOne({ username: username, password: password });

  if (auth) {
    userAuth = true;
    res.redirect("/");
  } else {
    userAuth = false;
    res.render("register", { users });
  }
});

router.get("/register", async (req, res, next) => {
  users = await User.find();
  res.render("register", { users });
});

router.post("/registerUser", async (req, res, next) => {
  let { name, username, password } = req.body;

  if (name && username && password) {
    const auth = User.findOne({
      name: name,
      username: username,
    });

    if (!auth) {
      const user = new User(req.body);
      await user.save();
      res.redirect("/");
    } else {
      await User.updateOne({ username: username }, req.body);
      res.redirect("/");
    }
  } else {
    console.error(`Re paila`);
  }
});

router.get("/logout", async (req, res, next) => {
  userAuth = false;
  res.render("login");
});

router.post("/add", async (req, res, next) => {
  const task = new Task(req.body);
  await task.save();
  res.redirect("/");
});

router.get("/turn/:id", async (req, res, next) => {
  let { id } = req.params;
  const task = await Task.findById(id);
  task.status = !task.status;
  await task.save();
  res.redirect("/");
});

router.get("/edit/:id", async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  res.render("edit", { task });
});

router.post("/edit/:id", async (req, res, next) => {
  const { id } = req.params;
  await Task.updateOne({ _id: id }, req.body);
  res.redirect("/");
});

router.get("/delete/:id", async (req, res, next) => {
  let { id } = req.params;
  await Task.deleteOne({ _id: id });
  res.redirect("/");
});

// router.get("/edit", (req, res) => {
//   res.render("editar");
// });

module.exports = router;
