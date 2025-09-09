const app = require("./src/app");
const connect = require("./src/database/db");
const port = 4000;

app.listen(port,()=>{
    console.log("SERVER SUCCESSFULLY CONNECTED");
    connect();
})