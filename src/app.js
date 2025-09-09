const express = require("express")
const path = require("path")
const userrouter = require("./routes/user.route")
const taskroute = require("./routes/task.route")
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))


app.use("/",userrouter)
app.use("/", taskroute);
module.exports = app;