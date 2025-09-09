const express = require("express");
const usersmodel = require("../models/user.model");
const Task = require("../models/task.model")
const router = express.Router();
const path = require("path");
const event = require("../models/add-event.model")


router.get("/" ,(req,res)=>{
    res.render("index");
})

router.get("/sign",(req,res)=>{
    res.send("Please Enter Data")
})

router.post("/sign",async (req,res)=>{
    const {email,password} = req.body;

    await usersmodel.create({
        email,
        password
    })
    res.send("SUCCESS")
})

router.post("/",async(req,res)=>{
    const {email,password} = req.body;

    const user = await usersmodel.findOne({email:email})

    if(!user) {
        return res.send("USER NOT SOUND PLEASE CONTACT TO MENTOR")
    }
    if(user.password != password){
        return res.send("Invalid Password")
    }
    res.redirect("/home");
})

router.get("/home",async (req,res)=>{
    try {
        // aaj ka date nikal lo
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
    
        // db se aaj ke tasks le aao
        const tasks = await Task.find({
          date: {
            $gte: today,
            $lt: tomorrow
          }
        });

        const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

const events = await event.find({}).sort("date");

const upcoming = events
  .filter(ev => {
    const evDate = new Date(ev.date);
    evDate.setHours(0, 0, 0, 0);
    return evDate >= todayDate;  // sirf aaj ya aage ke events
  })
  .map(ev => {
    const evDate = new Date(ev.date);
    evDate.setHours(0, 0, 0, 0);

    const diffTime = evDate - todayDate; // milliseconds
    const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
      title: ev.title,
      daysLeft: daysLeft === 0 ? "Today" : `${daysLeft} Days Left`
    };
  });

    
        // home.ejs ko render karo aur tasks bhejo
        res.render("home", { tasks,upcoming });
      } catch (err) {
        console.log(err);
        res.send("Error aaya");
      }
    });
module.exports = router;