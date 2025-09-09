const mongoose = require("mongoose");
const connect = ()=>{
    mongoose.connect("mongodb+srv://Mohit:ZyaypO1HFkmNo4KR@cluster0.safgwzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        console.log("SERVER CONNECTED");
    })
    .catch((err)=>{
        console.log(err);
    })
}


module.exports = connect;