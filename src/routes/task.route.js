const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');
const event = require("../models/add-event.model");
const movies = require("../models/movies.model");

// ================== TASKS ==================
router.get('/tasks', (req, res) => {
    if (!req.session.email) return res.status(401).send("Please login first");
    res.render('tasks');
});

router.post('/tasks', async (req, res) => {
    if (!req.session.email) return res.status(401).send("Please login first");

    const { title, description, date } = req.body;
    if (!title || !date) return res.status(400).json({ success: false, message: 'Title and date are required' });

    await Task.create({
        title,
        description,
        date,
        completed: false,
        email: req.session.email
    });

    res.send("SUCCESS");
});

// ================== EVENTS ==================
router.get("/add-event", (req, res) => {
    if (!req.session.email) return res.status(401).send("Please login first");
    res.render("add-event");
});

router.post("/add-event", async (req, res) => {
    if (!req.session.email) return res.status(401).send("Please login first");

    const { title, date } = req.body;

    await event.create({
        title,
        email: req.session.email,
        date
    });

    res.send("SUCCESS");
});

// ================== MOVIES ==================

router.post("/movies", async (req, res) => {
  // if (!req.session.email) return res.status(401).send("Please login first");

  const { name, category, status,email } = req.body;

  // ✅ Find if movie with same name already exists for this user
  const existingMovie = await movies.findOne({ email: email, name: name });

  if (existingMovie) {
    return res.send("MOVIE ALREADY EXIST");
  }

  await movies.create({
    name,
    category,
    status,
    email
  });

  res.send("SUCCESS");
});

router.get("/movies", async (req, res) => {
    if (!req.session.email) return res.status(401).send("Please login first");

    const userMovies = await movies.find({ email: req.session.email });

    const completedMovies = userMovies.filter(m => m.status === "completed");
    const notWatchedMovies = userMovies.filter(m => m.status === "not watched");

    res.render("./movies/movies", { completedMovies, notWatchedMovies });
});

module.exports = router;

