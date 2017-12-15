//global variables
var durationTrip;
var distanceTrip;
var directionsDisplay;
var directionsService;
var map;
var polyline;
var infowindowMarker = new google.maps.InfoWindow();
var markers=[];
var originObject;
var destinationObject;
var waypointObject;
var waypointPasstime=0;
var date;
var currentTime;
var currentMin;
var string="";
var durationDays;

function waypointDuration(toWaypointdurationString){
  var toWaypointdurationArray=toWaypointdurationString.split(" ");
  var arrayLength=toWaypointdurationArray.length;
  var toWaypointdurationHr;
  var toWaypointdurationMin;
  console.log(toWaypointdurationArray);
  switch (arrayLength){
    case 2:
      toWaypointdurationMin=parseInt(toWaypointdurationArray[0]);
      if(toWaypointdurationMin>30){
        toWaypointdurationHr=1;
        console.log("im here1")
      }
      else{
        toWaypointdurationHr=0;
        console.log("im here2")
      }
    break;
    case 4:
      if(toWaypointdurationArray[1]==="hours"||toWaypointdurationArray[1]==="hour"){
        toWaypointdurationHr=parseInt(toWaypointdurationArray[0]);
        toWaypointdurationMin=parseInt(toWaypointdurationArray[2]);
        console.log("im here");
      }
     else{
      toWaypointdurationHr=parseInt(toWaypointdurationArray[2]);
      toWaypointdurationMin=0;
      durationDays=parseInt(toWaypointdurationArray[0]);
      console.log("im here3");
     }
    break;
  }
  console.log(toWaypointdurationHr);
  console.log(toWaypointdurationMin);
  console.log(durationDays);
  calcWaypointTime(toWaypointdurationMin,toWaypointdurationHr);
  
}
function calcWaypointTime(toWaypointdurationMin,toWaypointdurationHr){
  waypointPasstime=0;
  if (toWaypointdurationMin>30){
    toWaypointdurationHr=toWaypointdurationHr+1;
  }
  else{
    toWaypointsdurationHr=toWaypointdurationHr;
  }
  waypointPasstime=currentTime+toWaypointdurationHr;
  console.log("currentTime"+currentTime);
  console.log("toWaypointdurationHr"+toWaypointdurationHr);
  if (waypointPasstime>24){
    waypointPasstime=(waypointPasstime-24)-1;
  }
  console.log(waypointPasstime)
}
//----------------DIRECTIONS API---------------------
function directionsAPI(originLat,originLng,markerPositionLat,markerPositionLng){
  var directionsKEY="AIzaSyAfNedlP-Xv-cl6ni8nbDMZD_red3X08WI";
  //trevor's backup AIzaSyAIq7MXbfsfyh18by7GqjrtP7xKeFmR-e8
  var directionsURL="https://cors-anywhere.herokuapp.com/"+"https://maps.googleapis.com/maps/api/directions/json?origin="+originLat+","+originLng+"&destination="+markerPositionLat+","+markerPositionLng+"&key="+directionsKEY;
  console.log(directionsURL);
  $.ajax({
    url: directionsURL,
    method:"GET"
  })
  .done(function(response){

    var waypointAddress=response.routes[0].legs[0].end_address;
    var toWaypointdurationString=response.routes[0].legs[0].duration.text;

    //determine if waypoint is mins/hrs/days
    waypointDuration(toWaypointdurationString);
    string=string+"</br>"+"<strong>"+waypointAddress+"</strong>";
   
  });
}


//------------------WEATHER API-----------------------------------
function undergroundWeatherAPI(latitude,longitude,marker){
  var undergroundWeatherapiKey="b26eea70cef99b97";
  var undergroundWeatherURL="http://api.wunderground.com/api/"+undergroundWeatherapiKey+"/hourly10day/q/"+latitude+","+longitude+".json";
  console.log(undergroundWeatherURL);
  $.ajax({
    //makesure you change this when user inputs
    url: undergroundWeatherURL,
    method:"GET"
  })
  .done(function(response){ 
    if(response.hourly_forecast[0]===" "){
      string="NO WHEATHER AVAIL FOR THIS LOCATION";
    }
    else{
      for (var i=0; i< response.hourly_forecast.length;i++){
        var responseHrinterger=parseInt(response.hourly_forecast[i].FCTTIME.hour);
        if(responseHrinterger===waypointPasstime){
          //time when passing the waypoint
          var time=response.hourly_forecast[i].FCTTIME.weekday_name;
          var weekDay=response.hourly_forecast[i].FCTTIME.civil;
          var temp="Temp: "+ response.hourly_forecast[i].temp.english+" °F";
          var condition=response.hourly_forecast[i].wx;
          var icon="<img src='"+response.hourly_forecast[i].icon_url+"'>";
          break;
        }
      }
      string=string+"</br>"+weekDay+" "+time+"</br>"+condition+"</br>"+icon+temp;
    }

    //OPENING WINDOW ABOVE MARKER WHEN CLICKED
    infowindowMarker.setContent(string);
    infowindowMarker.open(map,marker);
  })
}

//----------------DISPLAY DIRECTIONS-------------------
//map initial when nothing has been inputted
function initMap() {
  directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
  var Tucson= new google.maps.LatLng(32.2217,-110.9265);
    var mapOptions = {
      zoom:7,
      center:Tucson
  }
  map = new google.maps.Map(document.getElementById("mapBody"), mapOptions);
  directionsDisplay.setMap(map);
  polyline=new google.maps.Polyline({
    path:[],
    strokeColor:'red',
    stroWeight:3
  });

  //autocompletelocation
  initAutocomplete();
  initAutocompleteEnd();
}

//calculates the route
function calcRoute() {
  var request = {
    origin: $("#startLocation").val(),
    destination: $("#endLocation").val(),
    travelMode: 'DRIVING'
  };

  directionsService.route(request, function(response, status) {
    if (status == "OK" ) {
      //objects with lat and lng as functions
      originObject=response.routes[0].legs[0].start_location;
      originLat=originObject.lat();
      originLng=originObject.lng();
      destinationObject=response.routes[0].legs[0].end_location;
      //directionsDisplay.setDirections(response);
      polyline.setPath([]);
      var bounds=new google.maps.LatLngBounds();
      //array of onjects with the steps for everywaypoint
      var legs=response.routes[0].legs;
      //assigning the polyline its path based on the directions line
      var steps=legs[0].steps;
      for(var i=0;i<steps.length;i++){
        var nextSegment=steps[i].path;
        for(var j=0;j<nextSegment.length;j++){
          polyline.getPath().push(nextSegment[j]);
          bounds.extend(nextSegment[j]);
        }
      }
      polyline.setMap(map);
      directionsDisplay.setDirections(response);
      //erasing markers from previous mapping
      for(var i=0;i<markers.length;i++){
        markers[i].setMap(null);
      }
      markers=[];
      var mileValue=$("#mileValue option:selected").val();
      //creating the points along the polyline
      var points=getPointsAtDistance((mileValue*1609.34),originObject,destinationObject);
      for(var i=0;i<points.length;i++){
        //two marker declarations
        var marker = new google.maps.Marker({
          map:map,
          position:points[i],
          title:"Location" +(i+1)
        });

        //this is where we will display the weather Conditions
        marker.addListener('click', function(){
          
          var clickedMarker=this;
          var markerPositionObj=this.getPosition();
          var markerPosition=this.getPosition().toUrlValue(6);
          var array=markerPosition.split(",");
          var makerPositionLat=array[0];
          var makerPositionLng=array[1];
       
          //we want the tripduration and thewaypoint name
          directionsAPI(originLat,originLng,makerPositionLat,makerPositionLng);
          
          //CALLING THE WEATHER API AND PASSING LAT,LONG,AND MARKER
          undergroundWeatherAPI(makerPositionLat,makerPositionLng,clickedMarker);
          
          //resetting the variables used
          string="";
          
        });
        markers.push(marker);
      }

      /*durationTrip=response.routes[0].legs[0].duration.text;
      distanceTrip=response.routes[0].legs[0].distance.text;*/
    }
  }); 
}
//had to turn this to a function from eopoly.js because it was not being read
function getPointsAtDistance(meters,origin,destination){
  var next = meters;
  var points = [];
  // some awkward special cases
  if (meters <= 0){ 
    return points;
  }
  var dist=0;
  var olddist=0;
  for (var i=1; i < polyline.getPath().getLength(); i++) {
    olddist = dist;
    //distanceFrom is from epoly.js
    dist += polyline.getPath().getAt(i).distanceFrom(polyline.getPath().getAt(i-1));
    while (dist > next) {
      var p1= polyline.getPath().getAt(i-1);
      var p2= polyline.getPath().getAt(i);
      var m = (next-olddist)/(dist-olddist);
      points.push(new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m));
      next += meters;    
    }
  }
  //adding the starting and ending locations to the points array
  points.push(destination);
  points.unshift(origin);
  return points;
}

google.maps.event.addDomListener(window, 'load', initMap);

//-----------------geting usersinput--------------------
$("#runSearch").on("click",function(){

  var origin=$("#startLocation").val().trim();
  var destination=$("#startLocation").val().trim();
  

  if(origin&& destination!==" "){
    date=new Date();
    currentTime=parseInt(date.getHours());
    currentMin=parseInt(date.getMinutes());
    if(currentMin>30){
      currentTime=currentTime+1;
     
    }
    else{
      currenTime=currentTime;
    }
    console.log(currentTime);
    console.log(currentMin);
    calcRoute();
  }

});

//-------AUTOCOMPLETE
var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('startLocation')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', geolocate);
}



// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

 var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name2',
  route: 'long_name2',
  locality: 'long_name2',
  administrative_area_level_1: 'short_name2',
  country: 'long_name2',
  postal_code: 'short_name2'
};

function initAutocompleteEnd() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('endLocation')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', geolocateEnd);
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocateEnd() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}