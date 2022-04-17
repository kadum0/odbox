

//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors")
const path = require("path")
const multer  = require("multer") 


//express configuration 
app.use(express.json())
app.use(cors())

////////mongodb 
//// mongo atlas



////mongodb 
let mongodb = require("mongodb").MongoClient
const { ObjectID } = require("bson")
// const { markAsUntransferable } = require("worker_threads")
// let ObjectId = require('mongodb').ObjectID;
require("dotenv").config()
// let mongokey = "mongodb+srv://firstUser:LdUpMsCeuguJLKAe@cluster0.mf8v4.mongodb.net/db2?retryWrites=true&w=majority"


// const path = require('path')




////////// pages to send
// app.use(express.static("./public"))
app.get("/", (req, res)=>{
    res.sendFile(__dirname +"/public/index.html")
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




/////?? inserting 

// app.post("/loc", (req, res)=>{
    
//     console.log("post loc; "+req.body)

//     mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//     let dbb = client.db()

//     ////doc structure 
//     // Object.values(req.body).forEach(e=>dbb.collection("deleted").insertOne({path: e}))
//     dbb.collection("locs").insertOne({location: req.body.loc, title: req.body.title, mainImg: req.body.mainImg, log: []})
//     let results = await dbb.collection("locs").find().toArray()

//     res.send(results)
//     console.log(results)
//     })
// })


app.use("/img", (req, res)=>{
    res.sendFile((__dirname+"/img.html"))
    // res.sendFile("/projects/anybox/img.html")

})

////////////////multer configuring

////making storage plan
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./locs; imgs")
    },
    filename: (req, file, cb)=>{
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

//////making basic plan
const upload = multer({storage: storage})




//image handling
app.post("/upl", upload.single("image"),(req, res)=>{
    // res.json("image uploaded")
    console.log("get image")


    console.log(req.file)
    // console.log(req.body)


})




///////establishing
app.listen(process.env.PORT || 3442, ()=>console.log("listennig ..."))



