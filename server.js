

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
            dbb.collection("locs").insertOne({
                title: req.body.title, 
                etitle: req.body.etitle, 
                locImgPath: locImg,
                coords: req.body.coords.split(","), 
                currentConts: [],
                dists: []
            })
        })
        res.sendStatus(200)
    }else{
        res.sendStatus(400)
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


let contDir ///dir
let contFilList = [] ///file
let fil ///file name (path)

// let contStorage = multer.diskStorage({

//     destination: (req, file, cb)=>{
//         contDir = `./public/conts/${req.body.etitle}`
//         // contDirList.push(contDir)
//         fs.exists(contDir, exist => {
//             if (!exist) {
//                 return fs.mkdir(contDir, error => cb(error, contDir))
//             }
//             return cb(null, contDir)
//             })
//     },
//     filename: (req, file, cb)=>{
//         fil = new Date().toISOString().replace(/:/g, '-') +file.originalname.replaceAll(" ", "")
//         contFilList.push("./conts/"+req.body.etitle+fil)
//         cb(null, fil)
//     }
// })
// let uploadCont = multer({storage: contStorage})

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
        let foun = await dbb.collection("locs").findOneAndUpdate({etitle: req.body.etitle}, {$push: {currentConts: contsImgPathList}})

        // let found = await dbb.collection("locs").findOne({etitle:req.body.etitle})
        // console.log(found)
})

})


let newDistPath
let distSorage = multer.diskStorage({

    destination: (req, file, cb)=>{

        console.log("........destination.........")
        ///go to locs; find the right dir; based on the etitle in the req.body
        ///make before img and after img from files names
        ///make a cont folder and tralsate the imgs paths in body.path

        fs.readdir("./public/locs;imgs/"+req.body.etitle, async (err, file)=>{
            if(err)throw err
            let distDir = "dist-" + new Date().getFullYear() +"-" + new Date().getDate() +"-" + new Date().getDay()+"-" + new Date().getHours()+"-" + new Date().getMinutes()
            // let distDdir = distDir.replace(" ", "-")
            console.log(distDir)
            newDistPath = "./public/locs;imgs/"+req.body.etitle+"/" + distDir
            await fs.mkdir(newDistPath ,()=> cb(null, newDistPath))
            // cb(null, distDir)
        })

        console.log(req.body.etitle)
        console.log(file)

        // cb(null, './public/distImgs')

        ////go to locs; make a dist cont imgs folder with the dist number; tranlate to it the accepted imgs

        ///get the imgs link (path); then insert it in a ?? (list)


        // contDir = `./public/conts/${req.body.etitle}`
        // // contDirList.push(contDir)
        // fs.exists(contDir, exist => {
        //     if (!exist) {
        //         return fs.mkdir(contDir, error => cb(error, contDir))
        //     }
        //     return cb(null, contDir)
        //     })
    },
    filename: (req, file, cb)=>{

        console.log(".......file name...........")

        let fileName = file.fieldname+ "."+ file.originalname.split(".")[1]

        cb(null, fileName)

        console.log("/locs;imgs/"+req.body.etitle +fileName)

        ///get the intended doc and make an object to insert in it 
        // let d = await dbb.collection("locs").updateOne({etitle: req.body.etitle}, {$set: {dists: newDist}})
        // let d = await dbb.collection("locs").updateOne({etitle:
        // req.body.etitle}, { $set: { dists :[{file.fieldname: }] } })  /// no
        // update required but need to make an object and insert it at the dists
        // array
        
        // mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
        // let dbb = client.db()
        // })



        // fil = new Date().toISOString().replace(/:/g, '-') +file.originalname
        // contFilList.push("./conts/"+req.body.etitle+fil)
        // cb(null, fil)
    }
})
let uploadDist = multer({storage: distSorage})

////dist post
app.post("/dist", uploadDist.any(), async (req, res)=>{

    console.log(".......post dist........")

    ///////make object 
    let distObject ={}
    distObject.conts = []

    await fs.readdir(newDistPath, (err, files)=>{
        files.forEach(e=>{

            if(e.split(".")[0] == "A"){
                distObject.A = (newDistPath+"/"+e).replace("./public", "")
            }else{
                distObject.B = (newDistPath + "/"+ e).replace("./public", "")
            }
        // distObject.conts.push(newDistPath+"/"+e)
        })
    })

    ////making conts dir 
    await fs.mkdir(newDistPath +"/conts", ()=>console.log("created conts dir"))


    req.body.acceptedConts.split(",").forEach(async e=>{

        console.log(".......old paths.......")
        console.log(e)


        let oldP = "./public"+ e
        let ee = e.split("/")[e.split("/").length -1]
        // console.log(ee)
        let newP = newDistPath + "/conts/" + ee

        distObject.conts.push((newDistPath+"/conts/"+ee).replace("./public", ""))

        await fs.rename(oldP, newP, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')

            console.log(distObject)
        })
    })

    distObject.info = req.body.info
    distObject.date = req.body.date



    // fs.readdir()


    console.log(distObject)

    /////////mongodb side; 
    
    mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    let dbb = client.db()
        dbb.collection("locs").updateOne({etitle: req.body.etitle}, {$set:{dists: distObject}})
    })


    
    
    // fs.readdir(newDistPath, (err, files)=>{

    // })

    // console.log(req.body)
    // console.log(req.body.acceptedConts.split(","))
    // console.log(req.body.refusedConts.split(","))

    ////get into the intended dist path; get the a and b 
    ////change the path of the accepted conts 
    /// make an object to put the path of a, b and the rest changed conts in
    // form of array also the info and date 



    ///take a look on the loc folder; based on the body etitle; and take the
    ///imgs paths; b img, a img, conts imgs 
    ///make a post to the db; find based on the etitle; to insert on the dists array; 
    ///

})


/////////////////////test code 

////////deleting all 
    // mongodb.connect(process.env.MONGOKEY, async (err, client)=>{
    //     let dbb = client.db()    
    //     dbb.collection("locs").deleteMany()
    //     })





///////establishing
app.listen(process.env.PORT || 3000, ()=>console.log("listennig ..."))

