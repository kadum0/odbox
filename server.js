

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




////////// pages to send
// app.use(express.static("./public")) ///imgs
app.use(express.static("./public-imgs"))
app.use("/", express.static("./home"))
app.use("/mode", express.static("./mode"))



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

//////making locs storing plan; to remove 
// let storage2 =multer.diskStorage({
//     destination: (req, file, cb)=>{

//         console.log(req.body)
//         console.log(file)

//         let dir = `./public/locs;imgs/${req.body.etitle}`
//         fs.exists(dir, exist => {
//             if (!exist) {
//                 return fs.mkdir(dir, error => cb(error, dir))
//             }
//             return cb(null, dir)
//             })

//     }, 
//     filename: (req, file, cb)=>{
//         cb(null, "mainImg.png")
//     }
// })



let locImg
let locStoring = multer.diskStorage({
    destination: "./public-imgs", 
    filename: async (req, file, cb)=>{
        console.log(file)
        locImg = await new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
        cb(null, locImg)
    }
})
let multerLoc = multer({storage: locStoring})

//////locs 
app.post("/locs", multerLoc.any(), (req, res)=>{
    console.log(".......locs")
    console.log(req.body)

    ////db
    if(req.body.title&&req.body.etitle&&req.body.coords){
        mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
            let dbb = client.db()    

            ////check if used etitle
            if(!await dbb.collection("locs").findOne({etitle: req.body.etitle})){
                await dbb.collection("locs").insertOne({
                    title: req.body.title, 
                    etitle: req.body.etitle, 
                    locImgPath: locImg,
                    coords: req.body.coords.split(","), 
                    currentConts: [],
                    dists: []
                })
        res.sendStatus(200)

            }else{
                console.log("already used etitle")
                res.json({err: "already used etitle"})
            }
        })
    }else{
        res.json({err: "no data sent"})
    }
})

app.get("/locs", (req, res)=>{
    console.log("........get locs")

    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        let result = await dbb.collection("locs").find({}).toArray()
        console.log(result)
        res.json(result)
// res.json({title: result.title, etitle: result.etitle, mainImg: result.path, coords: result.coords, dists: result.dists})

})
})


////conts 
let contsImgPathList = []
let contStorage = multer.diskStorage({
    destination: "./public-imgs",
    filename: (req, file, cb)=>{
        let path = new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
        contsImgPathList.push(path)
        cb(null, path)
    }
})
let multerCont = multer({storage: contStorage})

/////conts route; no main db, no get 
////get into the loc and insert it in the locs conts; 
app.post("/conts",(req, res, next)=>{contsImgPathList= []; next()}, multerCont.array("Cont") , (req, res)=>{
    console.log(".....conts")
    console.log(req.body)

    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()

        contsImgPathList.forEach(async e=>{
            await dbb.collection("locs").findOneAndUpdate({etitle: req.body.etitle}, {$push: {currentConts: e}})
        })

        // let found = await dbb.collection("locs").findOne({etitle:req.body.etitle})
        // console.log(found)
})

})


// let distsImgPathList = []
let before 
let after 
let distStorage = multer.diskStorage({
    destination: "./public-imgs", 
    filename: (req, file, cb)=>{
        let path = new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
        file.fieldname == "before"?before = path: after= path
        // distsImgPathList.push(path)
        cb(null, path)
    }
})
let multerDist = multer({storage: distStorage})

//////dist 
app.post("/dist",(req, res, next)=>{before = ""; after = ""; next()}, multerDist.any(), (req, res)=>{
    console.log("...............dist")
    console.log(req.body)
    if((req.body.acceptedConts||req.body.refusedConts)&&req.body.refusedConts&&req.body.info&&req.body.etitle&&after&&before){

    acceptedConts = req.body.acceptedConts.split(",")
    refusedConts = req.body.refusedConts.split(",")

    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        let dbb = client.db()
        ////remove accepted 
        if(acceptedConts[0]){
            acceptedConts.forEach(async e=>{
                await dbb.collection("locs").findOneAndUpdate({etitle: req.body.etitle}, {$pull: {currentConts: e}})
            })
        }
        if(refusedConts[0]){
            ////remove refused
            refusedConts.forEach(async e=>{
                await dbb.collection("locs").findOneAndUpdate({etitle: req.body.etitle}, {$pull: {currentConts: e}})
            })
        }

        let addDIst = await dbb.collection("locs").findOneAndUpdate({etitle: req.body.etitle}, {$push: {dists: {
            before: before, 
            after: after,
            info: req.body.info,
            conts: acceptedConts, 
        }}})

        res.sendStatus(200)
    })
        }else{
            res.json({err: "no data sent"})
        }



    console.log(before)
    console.log(after)

})


/////////////////////test code 

////////deleting all 
    // mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    //     let dbb = client.db()    
    //     dbb.collection("locs").deleteMany()
    //     })


    /// //check if valid data;
    /// if(req.body.?&&req.body.??&&req.body.???[){...res.sendStatus(200)}else{res.json({err:"no data sent"})}


///////establishing
app.listen(process.env.PORT || 3000, ()=>console.log("listennig ..."))

