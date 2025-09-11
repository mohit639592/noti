const express = require("express");
const usersmodel = require("../models/user.model");
const Task = require("../models/task.model");
const event = require("../models/add-event.model");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/sign", (req, res) => {
    res.send("Please Enter Data");
});

router.post("/sign", async (req, res) => {
    const { email, password } = req.body;

    await usersmodel.create({
        email,
        password
    });
    res.send("SUCCESS");
});

// ================== LOGIN ==================
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    const user = await usersmodel.findOne({ email });
    if (!user) return res.send("USER NOT FOUND, PLEASE CONTACT MENTOR");
    if (user.password !== password) return res.send("Invalid Password");

    // ✅ Session set karo
    req.session.email = user.email;

    res.redirect("/home");
});

// ================== HOME ==================
router.get("/home", async (req, res) => {
    try {
        if (!req.session.email) {
            return res.send("Please login first");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // ✅ Tasks only for logged-in user
        const tasks = await Task.find({
            email: req.session.email,
            date: { $gte: today, $lt: tomorrow }
        });

        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        // ✅ Events only for logged-in user
        const events = await event.find({ email: req.session.email }).sort("date");

        const upcoming = events
            .filter(ev => {
                const evDate = new Date(ev.date);
                evDate.setHours(0, 0, 0, 0);
                return evDate >= todayDate;
            })
            .map(ev => {
                const evDate = new Date(ev.date);
                evDate.setHours(0, 0, 0, 0);

                const diffTime = evDate - todayDate;
                const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                return {
                    title: ev.title,
                    daysLeft: daysLeft === 0 ? "Today" : `${daysLeft} Days Left`
                };
            });

        res.render("home", { tasks, upcoming });
    } catch (err) {
        console.log(err);
        res.send("Error aaya");
    }
});

module.exports = router;
