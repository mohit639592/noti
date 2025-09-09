const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');
const event = require("../models/add-event.model")

router.get('/tasks', (req, res) => {
  res.render('tasks'); 
});


const mongoose = require('mongoose');

router.post('/tasks', async (req, res) => {
    const { title, description, date,email } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Title and date are required' });
    }

    await Task.create({
      title,
      description,
      date,
      completed: false,
      email
      // userId
    });
    res.send("SUCCESS");
    // res.status(201).json({ success: true, task: newTask });
});


module.exports = router;

router.get("/add-event",(req,res)=>{
  res.render("add-event");
})
router.post("/add-event",async(req,res)=>{
  const {title,email,date} = req.body;
  await event.create({
    title,
    email,
    date
  });
  res.send("SUCCESS")
})