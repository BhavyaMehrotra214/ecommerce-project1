const app  = require("./src/app")
const connect = require("./src/db/db")
const port = process.env.PORT

app.listen(port, ()=>{
    console.log("server started")
    connect();
})
