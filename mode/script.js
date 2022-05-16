
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



        ////////defining the objects
        let oldIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        ////getting icon; icon is special object not just an image
        let markerIcon = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-red.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });


        /////DOM elements 

        ///locs
        let sendLoc = document.querySelector("#sendLoc")
        let title = document.querySelector("#title")
        let etitle = document.querySelector("#etitle")
        let locImg = document.querySelector("#locImg")

        ///conts
        let contImgs = document.querySelector("#contImg")
        let sendCont = document.querySelector("#sendCont")

        ///dist
        let distBImg = document.querySelector("#distBImg")
        let distAImg = document.querySelector("#distAImg")
        let distInfo = document.querySelector("#distInfo")
        let sendDist = document.querySelector("#sendDist")


        /////template dom elements 
        let locImgTemp = document.querySelector("#locImgTemp")
        let imgCont = document.querySelector("#imgCont")
        let mainTitle = document.querySelector("#mainTitle")
        let conts = document.querySelector("#conts")

        let profile = document.querySelector("#profile") ///no need
        let main = document.querySelector("#main") ///no need
        let locTitle = document.querySelector("#locTitle") ///no need
        let mainImg = document.querySelector("#mainImg") ///no need
        let imgc = document.querySelector("#image") ///no need
        let img1 = document.querySelector("#img1") ///no need







        /////containers to deploy functionalities
        let tripleLinkedList = []
        let mobject = [] //??

        ////containers for sending locs 
        let currentCoords ////coords 
        let currentEtitle

        /////container for sending pers 
        let perList = []
        let currentID ////no need 
        let displayedContDivs = []
        let acceptedConts = []
        let refusedConts = []

        let filesCounter = 0

        /////containers for sending conts 

        /// ///per (dist) ////not to create the objects to send that need to be
        /// done when get send for it to get empty and not duplicated in case of
        /// sending request after a request 
        // let distObject = {}
        // let perObject



        //////////////////////features 

        ////getting data and images and insert them 
        window.onload = async () => {
            let d = await fetch("/locs")
            let pd = await d.json() ///or JSON.parse(pd)
            console.log("get from locs")
            console.log(pd)

            /////makeing dom 
            pd.forEach(e => {
                /////coords; lables
                let label = L.marker(e.coords).addTo(map)

                /////creating conts imgs and inserting them 
                if(e.currentConts[0] == !undefined){

                e.conts.forEach(mg => {

                    let con = document.createElement("div")
                    con.classList.add("con")

                    let img = document.createElement("img")
                    img.style.backgroundImage = `url(${mg})`
                    img.style.backgroundSize = "cover"
                    img.style.backgroundPosition = "center"
                    img.setAttribute("data-imgPath", mg)

                    let acceptBtn = document.createElement("button")
                    acceptBtn.classList.add("accept")
                    acceptBtn.textContent = "accept"

                    let refurseBtn = document.createElement("button")
                    refurseBtn.classList.add("refuse")
                    refurseBtn.textContent = "refuse"

                    con.append(img, acceptBtn, refurseBtn)


                    displayedContDivs.push(con)

                    //////functionality (eventlistener)
                    con.addEventListener("click", (event) => {
                        if (event.target.classList.contains("accept")) {
                            acceptedConts.push(event.target.parentElement.children[0]
                                .getAttribute("data-imgPath"))
                            ////removing the dom element 
                            event.target.parentElement.remove()
                        }
                        if (event.target.classList.contains("refuse")) {
                            refusedConts.push(event.target.parentElement.children[0]
                                .getAttribute("data-imgPath"))
                            ////removing the dom element 
                            event.target.parentElement.remove()
                        }
                    })
                })
            }
                /////linked list
                tripleLinkedList.push({
                    id: e.id, 
                    etitle: e.etitle,
                    title: e.title, 
                    imgPath: e.locImgPath,
                    label: label, 
                    perList: perList,
                    displayedContDivs: displayedContDivs
                })

                ////inserting the created dom on the template; on eventlistener 
                label.addEventListener("click", (e) => {

                    tripleLinkedList.forEach(tr => {
                        if (tr.label == e.target) {
                            locImgTemp.style.backgroundImage = `url(../${tr.imgPath})`
                            locImgTemp.style.backgroundSize = "cover"
                            locImgTemp.style.backgroundPosition = "center"

                            mainTitle.textContent = tr.title

                            tr.displayedContDivs.forEach(trImg => {
                                conts.append(trImg)
                            })

                            // currentID = tr[0]
                            currentEtitle = tr.etitle
                        }
                    })
                })

            })
        }




        // adding coordinates; 

        let addCoords = document.querySelector("#addingCoords")
        addCoords.onclick = () => {
            addCoords.classList.toggle("on")
        }

        map.addEventListener('click', function (ev) {
            if (addCoords.classList.contains("on")) {
                let latlng = map.mouseEventToLatLng(ev.originalEvent);
                let i = [latlng.lat, latlng.lng]
                let m = L.marker(i, {
                    icon: oldIcon
                }).addTo(map);
                mobject.push(m)

                ////object eventlistender
                m.addEventListener("click", (e) => {
                    mobject.forEach(ee => {
                        ee.setIcon(oldIcon)
                    })
                    e.target.setIcon(markerIcon)
                    currentCoords = e.target._latlng
                })
                currentCoords = i

                ////select current etitle

            }
        });






        ///////////end data 

        /////send loc
        sendLoc.addEventListener("click", async () => {

            console.log(currentCoords, title.value, etitle.value, locImg.files)
            let fd = new FormData()

            ///appending the intended data to the formData
            fd.append("coords", currentCoords)
            fd.append("title", title.value)
            fd.append("etitle", etitle.value)
            fd.append("image", locImg.files[0])

            ///////check if valid (not empty)
            if (currentCoords && title.value && etitle.value && locImg.files) {
                

                let d = await fetch("/locs", {
                    method: "POST",
                    body: fd
                })

                /////empty the data containers 
                currentCoords = undefined
                title.value = ""
                etitle.value = ""
                locImg.files = null
                console.log(locImg.files)
            }else{
                console.log("no data inserted")
                ////make a div and insert this message in it
            }
        })

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


            if (currentEtitle != undefined && contImgs.files != undefined) {

                // xml.open("POST", "/conts")
                // xml.send(fdCont)

                let d = await fetch("/conts", {
                    method: "POST",
                    // data: fdCont,
                    body: fdCont
                })
            }
        }

        /////send dist; 
        sendDist.addEventListener("click", async () => {

            console.log(distInfo.value)

            if (distBImg.files[0] && distAImg.files[0] && distInfo.value) {

                let distObject = {}

                distObject.B = distBImg.files[0]
                distObject.A = distAImg.files[0]
                distObject.info = distInfo.value
                distObject.acceptedConts = acceptedConts
                distObject.refusedConts = refusedConts
                distObject.data = new Date()
                distObject.locTitle = currentEtitle

                let fdDist = new FormData()
                fdDist.append("date", new Date())
                fdDist.append("etitle", currentEtitle)
                fdDist.append("info", distInfo.value)
                fdDist.append("acceptedConts", acceptedConts)
                fdDist.append("refusedConts", refusedConts)
                fdDist.append("B", distBImg.files[0])
                fdDist.append("A", distAImg.files[0])

                await fetch("/dist", {
                    method: "POST",
                    body: fdDist
                })

                console.log(fdDist)
                console.log(distObject)

                /////empty the containers; 
                distBImg.files[0] = null
                distAImg.files[0] = null
                distInfo.value = ""

            }

            // console.log(distObject)

        })




        ///////////////test code 

        window.onclick = () => {
            // console.log(currentCoords)
            // console.log(currentID)
            // console.log(title.value)
            // console.log(imgc.files)
        }

