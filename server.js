

//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors")
// let path = require("path")


//express configuration 
app.use(express.json())
app.use(cors())

////////mongodb 
//// mongo atlas

// let db = require("mongodb") ; // no need to it; old one
let mongodb = require("mongodb").MongoClient
const { ObjectID } = require("bson")
// const { markAsUntransferable } = require("worker_threads")
// let ObjectId = require('mongodb').ObjectID;
require("dotenv").config()
// let mongokey = "mongodb+srv://firstUser:LdUpMsCeuguJLKAe@cluster0.mf8v4.mongodb.net/db2?retryWrites=true&w=majority"

const path = require('path')




////////// pages to send
// app.use(express.static("./public"))
app.get("/", (req, res)=>{
    res.sendFile(__dirname +"/index.html")
    // res.sendFile(__dirname + "/public/map.js")
})

app.get("/mode", (req, res)=>{
    res.sendFile(__dirname+"/mode/moderator.html")
})


////// trying to send a whole folder (directory); 
// app.use('/mode', express.static('/mode'))
// app.use('/mode', express.static(path.join(__dirname, 'mode')))



// app.use(express.static('public'))



/////routes 




///////establishing
app.listen(process.env.PORT || 3442, ()=>console.log("listennig ..."))



