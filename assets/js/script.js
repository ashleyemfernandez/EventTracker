
var cityTextEl = $("#where");
var searchCityIDEl = $("#searchCityID");
var pageTitleEl = $("#page-title");
var ticketCardHolderEl = $("#ticket-card-holder");
var userFormEl = document.querySelector("googleMap");
var citiesArray = [];
var latArray = [];
var lonArray = [];


// API for Ticketmaster
var getTicketMasterInfo = function (event) {
  var userCity = cityTextEl[0].value;

  latArray = [];
  lonArray = [];
  setLocalStorage(userCity);

  var apiUrl =
    "https://app.ticketmaster.com/discovery/v2/events/?apikey=GC2GWOqVAojsGdOJA1N1FM1RbT4Hzc94&source=ticketmaster&classificationName=music&sort=date,asc&city=" +
    userCity;
    console.log(apiUrl)

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      ticketCardHolderEl.empty();

      var indexNumbers = ["0", "1", "2", "3", "4", "5", "6", "7"];
      indexNumbers.forEach(function (indexNumber) {
        var eventName = data._embedded.events[indexNumber].name;
        var eventImageURL = data._embedded.events[indexNumber].images[1].url;

        var eventVenue =
          data._embedded.events[indexNumber]._embedded.venues[0].name;
        var eventDate = dayjs(
          data._embedded.events[indexNumber].dates.start.localDate,
          "YYYY-MM-DD"
        ).format("MM/DD/YYYY");
        var eventTime = data._embedded.events[indexNumber].dates.start.localTime;
        var lat =
          data._embedded.events[indexNumber]._embedded.venues[0].location
            .latitude;
        var lon =
          data._embedded.events[indexNumber]._embedded.venues[0].location
            .longitude;
        var eventURL = data._embedded.events[indexNumber].url;
        var cardCol = $("<section>").addClass(
          "col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-4"
        );
        var cardHolder = $("<section>").addClass(
          "card border border-light mt-4 h-100"
        );
        var cardImg = $("<img>")
          .attr("src", eventImageURL)
          .addClass("card-img-top");
        var cardBody = $("<section>").addClass("card-body text-center");
        var cardName = $("<h5>").text(eventName).addClass("card-title");
        var cardVenue = $("<p>").text(eventVenue).addClass("card-text");
        var cardDateTime = $("<p>")
          .text(eventDate + " - " + eventTime)
          .addClass("card-text");
       
        cardBody.append(
          cardName,
          cardVenue,
          cardDateTime,
          
        );
        cardHolder.append(cardImg, cardBody);
        cardCol.append(cardHolder);
        ticketCardHolderEl.append(cardCol);
        latArray.push(lat);
        lonArray.push(lon);
      });
      
    })
    .then(function(){
      loadMap();
    })
};

// Local storage, working on autocomplete
function setLocalStorage(city) {
  cityTextEl.val("");
  if (city === "") {
    return;
  }

  if (!localStorage.getItem("city")) {
    localStorage.setItem("city", "[]");
  } else {
    citiesArray = JSON.parse(localStorage.getItem("city"));
  }

  if (!citiesArray.includes(city)) {
    citiesArray.push(city);
  } else {
    console.log("repeat");
  }

  localStorage.setItem("city", JSON.stringify(citiesArray));
  renderLocalStorage();
}

function renderLocalStorage() {
  var savedCities = JSON.parse(localStorage.getItem("city"));

  if (savedCities === null) {
    console.log("nothing in local storage");
  } else {

  }
}

function pageReload() {
  console.log("reload me");
  location.reload();
}

searchCityIDEl.on("click", getTicketMasterInfo);

pageTitleEl.on("click", pageReload);

renderLocalStorage();

// Map Listener
const targetSection = document.querySelector("#map");
const cardButton = document.querySelector(".btn");

function loadMap() {
  if (targetSection.style.display !== "none") {
    console.log("none")
  } else {
    targetSection.style.display = "flex";
console.log("flex")  
}

  initMap();
console.log("initMap");
};
// Initialize Map
function initMap() {
  var newlatArray = latArray;
  var newlonArray = lonArray;

  newLat1 = newlatArray[0];

  newLon1 = newlonArray[0];

if (newLat1) {
  
  var mapOptions = {
    center: new google.maps.LatLng(newLat1, newLon1),
    zoom: 10,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DEAFULT,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
  };

// Display Map
  var map = new google.maps.Map(
    document.querySelector("#map"),
    mapOptions
  );

}
}
