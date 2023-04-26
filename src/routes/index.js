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
  try {
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
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = req.body.password === user.password;
      if (result) {
        userAuth = true;
        res.redirect("/");
      } else {
        res.status(400).json({ error: "incorrect password" });
      }
    } else {
      res.render("register");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/register", async (req, res, next) => {
  try {
    users = await User.find();
    res.render("register", { users });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/registerUser", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = req.body.name === user.name;
      if (result) {
        await User.updateOne({ username: username }, req.body);
      }
    } else {
      const user = new User(req.body);
      await user.save();
      res.redirect("/");
    }
  } catch (error) {
    res.status(400).json({ error: "No se pudo guardar" });
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    userAuth = false;
    res.render("login");
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.redirect("/");
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/turn/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    const task = await Task.findById(id);
    task.status = !task.status;
    await task.save();
    res.redirect("/");
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/edit/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    res.render("edit", { task });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Task.updateOne({ _id: id }, req.body);
    res.redirect("/");
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    await Task.deleteOne({ _id: id });
    res.redirect("/");
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
