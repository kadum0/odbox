
        ///////////////////////////////////////////////////////////////////////
        ////setting up 

        const map = L.map('map').setView([33.396600, 44.356579], 9); //leaflet basic map
        //tile layer
        const apiKey = 'pk.eyJ1IjoiYWxmcmVkMjAxNiIsImEiOiJja2RoMHkyd2wwdnZjMnJ0MTJwbnVmeng5In0.E4QbAFjiWLY8k3AFhDtErA';

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: apiKey
        }).addTo(map);

        L.Control.geocoder().addTo(map);



        // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        //     subdomains: ['a', 'b', 'c']
        //   }).addTo(map); //Creates the attribution box at the top bottom right of map.
    
    

        // const provider = new window.GeoSearch.OpenStreetMapProvider();
        // const search = new GeoSearch.GeoSearchControl({
        // provider: provider,
        // style: 'bar',
        // updateMap: true,
        // autoClose: true,
        // }); // Include the search box with usefull params. Autoclose and updateMap in my case. Provider is a compulsory parameter.
    
        // L.marker([51.0, -0.09]).addTo(map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.'); //Creates a marker at [latitude, longitude] coordinates.
    
    


        // //////defining the objects
        // let oldIcon = L.icon({
        //     iconUrl: "./marker-icon-2x-green.png",
        //     shadowSize: [50, 64], // size of the shadow
        //     shadowAnchor: [4, 62], // the same for the shadow
        //     iconSize: [25, 41],
        //     iconAnchor: [12, 41],
        // });

// marker-icon.png

        let oldIcon = L.icon({
            iconUrl: "./marker-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        })

        ////getting icon; icon is special object not just an image
        let markerIcon = L.icon({
            iconUrl: "./marker-icon-2x-red.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });


        /////DOM elements 

        ///conts
        let contImgs = document.querySelector("#contImg")
        let sendCont = document.querySelector("#sendCont")

        /////template dom elements 
        let locImgTemp = document.querySelector("#locImgTemp")
        let imgCont = document.querySelector("#imgCont")
        let mainTitle = document.querySelector("#mainTitle")



        /////containers to deploy functionalities
        let tripleLinkedList = []
        let m 

        ////containers for sending locs 
        let currentCoords ////coords 
        let currentEtitle

        /////container for sending pers 
        let currentID ////no need 
        let displayedDistDivs = []

        //////////////////////features 

        /// /getting data and images and insert them; there are some conditions
        /// to display the current conts if exist; then to add them when making per 
        window.onload = async () => {
            let d = await fetch("/locs")
            let pd = await d.json() ///or JSON.parse(pd)
            console.log("get from locs")
            console.log(pd)

            /////makeing dom 
            pd.forEach(e => {
                /////coords; lables
                let label = L.marker(e.coords).addTo(map)

            //////dists
            console.log(typeof e.dists)
            displayedDistDivs=[]
            if(e.dists[0]){
                Object.values(e.dists).forEach(ee=>{
                    console.log(ee)
                    ////make doms 
                    let distDiv = document.createElement("div")
                    distDiv.classList.add("distDiv")

                    let beforeAndAfterImgs = document.createElement("div")
                    beforeAndAfterImgs.classList.add("beforeAndAfterImgs")
                    let beforeImg = document.createElement("img")
                    beforeImg.style.backgroundImage = `url(../${ee.before})`
                    beforeImg.style.backgroundSize = "cover"
                    beforeImg.style.backgroundPosition = "center"

                    let afterImg = document.createElement("img")
                    afterImg.style.backgroundImage = `url(../${ee.after})`
                    afterImg.style.backgroundSize = "cover"
                    afterImg.style.backgroundPosition = "center"

                    beforeAndAfterImgs.append(beforeImg, afterImg)



                    let info = document.createElement("p")
                    info.textContent = ee.info

                    distDiv.append(beforeAndAfterImgs)

                    if(ee.conts[0]){
                        let contsImgs = document.createElement("div")
                        contsImgs.classList.add("contsImgs")

                        let imgs = []
                        ee.conts.forEach(eee=>{
                            let img = document.createElement("img")
                            img.style.backgroundImage = `url(../${eee})`
                            img.style.backgroundSize = "cover"
                            img.style.backgroundPosition = "center"
                            imgs.push(img)
                        })
                        imgs.forEach(eeee=>contsImgs.append(eeee))
                        distDiv.append(contsImgs)
                    }

                    distDiv.append(info)


                    displayedDistDivs.push(distDiv)
                })
            }

                /////linked list
                tripleLinkedList.push({
                    id: e.id, 
                    etitle: e.etitle,
                    title: e.title, 
                    imgPath: e.locImgPath,
                    label: label, 
                    displayedDistDivs: displayedDistDivs
                })

                ////inserting the created dom on the template; on eventlistener 
                label.addEventListener("click", (e) => {

                    tripleLinkedList.forEach(e=>{e.label.setIcon(oldIcon)})
                    e.target.setIcon(markerIcon)

                    tripleLinkedList.forEach(tr => {
                        if (tr.label == e.target) {
                            locImgTemp.style.backgroundImage = `url(../${tr.imgPath})`
                            locImgTemp.style.backgroundSize = "cover"
                            locImgTemp.style.backgroundPosition = "center"

                            mainTitle.textContent = tr.title

                            document.querySelector("#distContainer").innerHTML = ""

                            // console.log(tr.displayedDistDivs)
                            tr.displayedDistDivs.forEach(trImg => {
                                document.querySelector("#distContainer").append(trImg)
                            })

                            // currentID = tr[0]
                            currentEtitle = tr.etitle
                        }
                    })
                })

            })


                ////get the routes 
        ///fetching data; 
        let routes= await fetch("/confirmed")
        pathList = await routes.json()
        document.querySelector("#displaylines").removeAttribute("disabled")
        console.log(pathList)

        }


        let pathObjects = []
        let pathList 
        
        function displayLines (pd){
            console.log("get routes; ", pd)
            
            Object.values(pd).forEach(e=>console.log(e.path))
        
            ///deploy them; store
            Object.values(pd).forEach(e => {
        
                let obje 
        
                if(typeof e.path[0]!="number"){
        
                    console.log(e.path)
                    obje = L.polyline(e.path, {
                        // color: "red",
                    }).addTo(map)
                    // oldObjects.push(pathId) //dont need old objects
                    // pathob.addEventListener("click", (e) => console.log(e.target))
                } else { ////labels part 
                    console.log("....label....")
        
                    obje = L.circle(e.path, {
                        fillColor: '#3388FF',
                        fillOpacity: 0.8,
                        radius: 100
                    }).addTo(map)
                }
        
                pathObjects.push(obje)
                obje.addEventListener("mouseover", (e)=>{
                    pathObjects.forEach(e=>{e.setStyle({color: "#3388FF", fillColor: "#3388FF"})})
                    let i = e.target
                    map.removeLayer(e.target)
                    i.addTo(map)
                    pathObjects.push(i)
                    i.setStyle({color:"rgb(223, 39, 39)", fillColor: "rgb(223, 39, 39)"})
                })
                obje.addEventListener("click", (e)=>{
                    pathObjects.forEach(e=>{e.setStyle({color: "#3388FF", fillColor: "#3388FF"})})
                    let i = e.target
                    map.removeLayer(e.target)
                    i.addTo(map)
                    pathObjects.push(i)
                    i.setStyle({color:"rgb(223, 39, 39)", fillColor: "rgb(223, 39, 39)"})
                })
            })
        }
        function hideLines(pd){
            pd.forEach(e=>{
                map.removeLayer(e)
            })
        }
                

//////button that shows the lines 
document.querySelector("#displaylines").addEventListener("click", (e)=>{
    console.log(e.target.classList)

    e.target.classList.toggle("add")
    if(e.target.classList.contains("add")){
        displayLines(pathList)
        // e.target.parentElement.append(suggetstMakeLinesBtn)
        document.querySelector(".suggest").style.display = "block"
    }else{
        hideLines(pathObjects)
        // e.target.parentElement.lastElementChild.remove()
        document.querySelector(".suggest").style.display = "none"

    }
})



        ///////////send data 

        ////send cont
        sendCont.onclick = async () => {

            let fdCont = new FormData()

            fdCont.append("etitle", currentEtitle)
            for (let i of contImgs.files) {
                fdCont.append(`Cont`, i);
                console.log(i)
            }
            console.log(fdCont)
            console.log(currentEtitle)


            if (currentEtitle&& contImgs.files[0]){

                let d = await fetch("/conts", {
                    method: "POST",
                    // data: fdCont,
                    body: fdCont
                })
            }
        }

        ///////////////test code 

        window.onclick = () => {
        }

