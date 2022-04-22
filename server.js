

//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors")
const path = require("path")
const fs = require("fs")
const multer  = require("multer") 
let bodyParser = require('body-parser')

app.use(cors())

//express configuration 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json()) /// no need
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: true})) //no need


////////mongodb 
//// mongo atlas

let mongodb = require("mongodb").MongoClient  ///mongodb atlas
const { ObjectID } = require("bson") 
// const { markAsUntransferable } = require("worker_threads")
// let ObjectId = require('mongodb').ObjectID;
require("dotenv").config()
// let mongokey = "mongodb+srv://firstUser:LdUpMsCeuguJLKAe@cluster0.mf8v4.mongodb.net/db2?retryWrites=true&w=majority"




////////// pages to send
app.use(express.static("./public"))
app.get("/mode", (req, res)=>{
    res.sendFile((__dirname+"/moderator.html"))
})

////// trying to send a whole folder (directory) based on path; 
// app.use('/mode', express.static('/mode'))
// app.use('/mode', express.static(__dirname+'/mode'))
// app.use('/mode', express.static(path.join(__dirname, 'mode')))



////////////////////////////////plan 
///feature 1; post 
///feature 1; get

///feature 2; post
///feature 2; get 

///feature 3; post
///feature 3; get


////post request; same route for both json data; currentCoords and form data; image, title,
///get data 
///insert them locally 
///make an object to be sent to the db; sent coords, title, resulted path  

////get request 
///get; conts; get all docs from conts collection 
///structure it in specific object form 
///send it in a res 


////////////routes 

//////making locs storing plan
let storage2 =multer.diskStorage({
    destination: (req, file, cb)=>{

        console.log(req.body)
        console.log(file)

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


let it ={}  ///may should be defined at the route

//////locs 
app.post("/locs", upload2.any(), (req, res)=>{
    console.log(req.body)

    ////////////setting object data container
    it.title = req.body.title
    it.etitle = req.body.etitle
    it.path = `/locs;imgs/${req.body.etitle}/mainImg.png`
    it.coords = req.body.coords.split(",")
    it.pers = []
    it.conts = []

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

    let obj = {}

    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        ////locs
        let results = await dbb.collection("locs").find().toArray()

        /// ////getting the conts imgs paths related to the intended loc
        /// cant access the dir
        await results.forEach(e=>{
            console.log("/conts/"+e.etitle)
            console.log(path.join("\conts", e.etitle))

            fs.readdir("./public/conts/"+e.etitle, (err, files)=>{

                console.log("about to files foreach")
                console.log(files)

                if(err) throw err

                if(files != undefined){
                files.forEach(ee=>{

                    console.log(ee)
                    e.conts.push("./conts"+e.etitle+ee)
                })
                }
            })
        })

        setTimeout(() => {
            
        console.log(results)
        console.log("results conts is; ")
        console.log(results[0].conts)
        res.send(results)


        }, 200);
        // console.log(results)
        })

})



////conts storing plan
let contDir ///dir
let contFilList = [] ///file
let fil ///file name (path)

let contStorage = multer.diskStorage({

    destination: (req, file, cb)=>{
        contDir = `./public/conts/${req.body.etitle}`
        // contDirList.push(contDir)
        fs.exists(contDir, exist => {
            if (!exist) {
                return fs.mkdir(contDir, error => cb(error, contDir))
            }
            return cb(null, contDir)
            })
    },
    filename: (req, file, cb)=>{
        fil = new Date().toISOString().replace(/:/g, '-') +file.originalname
        contFilList.push("./conts/"+req.body.etitle+fil)
        cb(null, fil)
    }
})
let uploadCont = multer({storage: contStorage})

/////conts route
app.post("/conts", uploadCont.array("Cont"), (req, res)=>{

    console.log("post conts")
    console.log(req.body)
})




/////////////////////test code 

////////deleting all 
    // mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    //     let dbb = client.db()    
    //     dbb.collection("locs").deleteMany()
    //     })





///////establishing
app.listen(process.env.PORT || 3001, ()=>console.log("listennig ..."))

