let cityInput = document.getElementById("cityInput");
let searchBtn = document.getElementById("searchBtn");
let cityName = document.querySelector(".cityName");
let eventContainer = document.getElementById("event-container");
let historyItems = document.querySelector(".historyItems");
let eventInfoDiv = document.querySelector(".eventInfoDiv");
let button = document.querySelector("button");
let geocoder;
let map;
let markers =[];
window.initMap = initialize //initializing map

searchBtn.addEventListener("click", searchFunc);

//function that initializes the map onto the screen
function initialize(){
console.log("Map initialize");
geocoder = new google.maps.Geocoder();
let latlng = new google.maps.LatLng(-34.397, 150.644);
let mapOptions = {
    zoom: 8,
    center: latlng
}
map = new google.maps.Map(document.getElementById("map"), mapOptions)
}

//pulls the value of cardBtn and displays a marker on the map
// TODO: markers keep adding instead of updating/clearing off map, figure out how to remove markers.
function codeAddress(address){
    geocoder.geocode({ "address": address}, function(results, status){
        if (status == "OK"){
            map.setCenter(results[0].geometry.location);
            let marker = new google.maps.Marker({
                map: map,
                icon: {
                          path: user-music.icon[4],
                          fillColor: “#D6AD60,
                          fillOpacity: 1,
                          anchor: new google.maps.Point(
                            user-music.icon[0] / 2, // width
                            user-music.icon[1] // height
                          ),
                          strokeWeight: 1,
                          strokeColor: "#ffffff",
                          scale: 0.075,
                        },
                position: results[0].geometry.location
            })
        } else {
            eventInfoDiv.innerHTML=`Geocode was not successful for the following reason: ${status}`; 
        }
    })
}


//activates search button
function searchFunc(){
    if (searchBtn){
        fetchDataEvents(cityInput.value)
        setStorage()
    } cityInput.value=" "
    initialize()
}

//fetches API events from ticketmaster and appends cards dynamically
function fetchDataEvents(value){
    eventContainer.innerHTML=" "
fetch("https://app.ticketmaster.com/discovery/v2/events.json?city=["+value+"]&size=31&sort=date,asc&apikey=GC2GWOqVAojsGdOJA1N1FM1RbT4Hzc94")
    .then((res)=>res.json())
    .then((data)=>{
        cityName.innerHTML=data._embedded.events[0]._embedded.venues[0].city.name
        console.log(data)
        let events = data._embedded.events
        events.forEach(event=>{
            console.log(event)
            let cardObject = document.createElement("div");
            cardObject.className="card"
            let date = new Date(event.dates.start.localDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              }); //used template literal to loop through data and pull data into card - A updated to show only month and day and time in hours and minutes
            let address =`${event._embedded.venues[0].address.line1}, ${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode}`
            
            cardObject.innerHTML = `
          <h5 style="font-weight: bold; font-size: 20px;">${event.name}</h5> 
          <img class="image" src=${event.images[0].url}>
          <p>${date}</p>
          <p>${address}</p>
          <button class="cardBtn" value="${address}">Pin to map</button>`; //made title bigger and bolder

            eventContainer.appendChild(cardObject)

//adding eventListnener to hardcoded parent of dynamic cards
    eventContainer.addEventListener("click", function(e){
        eventInfoDiv.innerHTML=""
        if(e.target.tagName==="BUTTON"){
            const button = e.target;
                if(button.className==="cardBtn"){
                    codeAddress(button.value)
                    eventInfoDiv.innerHTML=`<p>${button.value}</p>`;
                }
                }
            })
        })
    });
}

//function for setting storage
let cityArr=[]

function setStorage(){
    JSON.parse(localStorage.getItem("cityArr"))
    cityArr.push(cityInput.value)
    localStorage.setItem("cityArr", JSON.stringify(cityArr)) //setting up the array of cities in local storage

    cityArr.forEach(function(value){
        cityArr.shift(cityInput.value) //removes first item from array

//appending history buttons
        let newDiv= document.createElement("button");
        newDiv.innerHTML=value
        newDiv.className="historyBtn"
        historyItems.appendChild(newDiv)
    })
}

//makes clickable history buttons
historyItems.addEventListener("click", function(e){
    if (e.target.tagName==="BUTTON"){
        const button = e.target;
        if (button.className==="historyBtn"){
            fetchDataEvents(button.innerHTML)
        }
    }
})