const mongoose = require("mongoose");
const connect = ()=>{
    mongoose.connect("mongodb://localhost:27017/")
    .then(()=>{
        console.log("SERVER CONNECTED");
    })
    .catch((err)=>{
        console.log(err);
    })
}


module.exports = connect;