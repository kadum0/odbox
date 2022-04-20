

//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors")
const path = require("path")
const fs = require("fs")
const multer  = require("multer") 
let bodyParser = require('body-parser')

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//express configuration 
// app.use(express.json())

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



/////////////multer configuring

///////making storage plan
// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         // cb(null, "./locs; imgs")
//         cb(null, `./locs; imgs/${req.body.title}`)

//     },
//     filename: (req, file, cb)=>{
//         // console.log(file)
//         cb(null, Date.now() + path.extname(file.originalname))
//         // cb(null, "mainImg")

//     }
// })


// let dirna 


//

// const storage = multer.diskStorage({
// ///storage plan; dest, naming, limitaiton, error handling ??

//     destination: (req, file, cb) => {
//     //let userId  = req.body.title
//     //console.log(JSON.parse(JSON.stringify(req.body)))
//     //let dir = `./locs; imgs/${req.body.title}`
//     let dir = `./public/locs;imgs/${req.body.etitle}`
//     dirna = req.body.title

//     fs.exists(dir, exist => {
//     if (!exist) {
//         return fs.mkdir(dir, error => cb(error, dir))
//     }
//     return cb(null, dir)
//     })

//     console.log(dir)
//     },
//     filename: (req, file, cb) => {
//     //   const { userId } = req.body.title
//     // cb(null, `UserId-${userId}-Image-${Date.now()}.png`)
//     cb(null, `mainImg.png`)
//     console.log(file)
//     }
//     })

// const upload = multer({storage: storage})


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




//image handling trying
// app.post("/upl", upload.any(),(req, res)=>{
//     // res.json("image uploaded")
//     console.log("get image")
//     console.log(req.file)
//     console.log(req.body)
    
//     console.log(JSON.parse(JSON.stringify(req.body)))

//     // console.log(req.body.img)
//     // console.log(req.body.name)
//     res.json("good")
// })


// app.get("/upl", (req, res)=>{
//     // res.json(dir+"/mainImg.png")
//     res.json(`/locs;imgs/${dirna}/mainImg.png`)  ///basic sending image formula
//     // res.send(dir+"/mainImg.png")
//     console.log(dir+"/mainImg.png")
// })



//////new plan 

// let ii 
let it ={}


//////locs 
app.post("/locs", upload2.any(), (req, res)=>{
    console.log( typeof req.body.coords)
    // it.coords = req.body.coords

// console.log(req.body)

    ////////////
    it.title = req.body.title
    it.path = `/locs;imgs/${req.body.etitle}/mainImg.png`
    // it.coords = req.body.coords.split(",")
    it.coords = req.body.coords.split(",")

    // it.coords = req.body.coords
    // it.pers = []

    console.log(it)

    it={}


    // it.title = undefined
    // it.coords = undefined
    // it.path = undefined

    console.log(it)

    // mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    //     let dbb = client.db()    
    //     dbb.collection("locs").insertOne(it)
    //     })

})



/////old post; form tag method; 
// app.post("/locsF", upload.any() ,(req, res)=>{
//     // console.log(req.body)
//     it.title = req.body.title
//     it.path = `/locs;imgs/${req.body.etitle}/mainImg.png`
//     // it.pers = []

//     console.log(it)

//     mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
//         let dbb = client.db()
    
//         dbb.collection("locs").insertOne(it)
//         // let results = await dbb.collection("locs").find()
//         // let results = await dbb.collection("locs").find().toArray()
    
//         // res.send(results)
//         // console.log(results)
//         })

//     res.json("nice")
// })



app.get("/locs", (req, res)=>{
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
    
        // dbb.collection("locs").insertOne(it)
        // let results = await dbb.collection("locs").find()
        let results = await dbb.collection("locs").find().toArray()
    
        res.send(results)
        // console.log(results)
        })

})


/////making the main object to send for; locs







///////establishing
app.listen(process.env.PORT || 3442, ()=>console.log("listennig ..."))

