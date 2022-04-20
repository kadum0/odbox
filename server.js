

//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors")
const path = require("path")
const fs = require("fs")
const multer  = require("multer") 
let bodyParser = require('body-parser')

//express configuration 
// app.use(express.json())

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))


app.use(cors())


////////mongodb 
//// mongo atlas

let mongodb = require("mongodb").MongoClient
const { ObjectID } = require("bson")
// const { markAsUntransferable } = require("worker_threads")
// let ObjectId = require('mongodb').ObjectID;
require("dotenv").config()
// let mongokey = "mongodb+srv://firstUser:LdUpMsCeuguJLKAe@cluster0.mf8v4.mongodb.net/db2?retryWrites=true&w=majority"




////////// pages to send
app.use(express.static("./public"))
// app.get("/", (req, res)=>{
//     res.sendFile(__dirname +"/public/index.html")
//     // res.sendFile(__dirname + "/public/map.js")
// })

app.get("/mode", (req, res)=>{
    res.sendFile(__dirname+"/mode/moderator.html")
})

app.get("/img", (req, res)=>{
    res.sendFile((__dirname+"/img.html"))
    // res.sendFile("/projects/anybox/img.html")
})

////// trying to send a whole folder (directory); 
// app.use('/mode', express.static('/mode'))
// app.use('/mode', express.static(path.join(__dirname, 'mode')))



////////////////////////////////routes 


////post request; same route for both json data; currentCoords and form data; image, title,
///get data 
///insert them locally 
///make an object to be sent to the db; sent coords, title, resulted path  

////get request 
///get; conts; get all docs from conts collection 
///structure it in specific object form 
///send it in a res 


//////making second plan 
let storage2 =multer.diskStorage({
    destination: (req, file, cb)=>{

        console.log(req.body)
        console.log(file)
        // let trimmed = req.body.etitle.trim()
        let dir = `./public/locs;imgs/${req.body.etitle}`
        fs.exists(dir, exist => {
            if (!exist) {
                return fs.mkdir(dir, error => cb(error, dir))
            }
            return cb(null, dir)
            })

    }, 
    filename: (req, file, cb)=>{
        cb(null, "mainImg.png")
    }
})

let upload2 = multer({storage: storage2})

let it ={}

//////locs 
app.post("/locs", upload2.any(), (req, res)=>{
    console.log(req.body)

    ////////////setting object data container
    it.title = req.body.title
    it.path = `/locs;imgs/${req.body.etitle}/mainImg.png`
    it.coords = req.body.coords.split(",")
    it.pers = []

    console.log(it)


    ////db
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()    
        dbb.collection("locs").insertOne(it)

    ////empty
    it={}
    // it.title = undefined
    // it.coords = undefined
    // it.path = undefined

    console.log(it)

        })

})


app.get("/locs", (req, res)=>{
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let results = await dbb.collection("locs").find().toArray()
        res.send(results)
        // console.log(results)
        })

})


/////making the main object to send for; locs


/////////////////////test code 

////////deleting all 
    // mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    //     let dbb = client.db()    
    //     dbb.collection("locs").deleteMany()
    //     })







///////establishing
app.listen(process.env.PORT || 3442, ()=>console.log("listennig ..."))

