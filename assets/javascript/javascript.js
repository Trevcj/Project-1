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
//----------------DIRECTIONS API---------------------
function directionsURL(startLocation, endLocation){
  var directionsKEY="AIzaSyAfNedlP-Xv-cl6ni8nbDMZD_red3X08WI";
  //trevor's backup AIzaSyAIq7MXbfsfyh18by7GqjrtP7xKeFmR-e8
  var directionsURL="https://cors-anywhere.herokuapp.com/"+"https://maps.googleapis.com/maps/api/directions/json?origin="+startLocation+"&destination="+endLocation+"&key="+directionsKEY;
  return directionsURL;
}

function getDirectionsAPI(){
  $.ajax({
    url: directionsURL(startLocation,endLocation),
    method:"GET"
  })
  .done(function(response){
  });
}

//------------------WEATHER API-----------------------------------
function undergroundWeatherAPI(latitude,longitude,marker){
  var undergroundWeatherapiKey="b26eea70cef99b97";
  var undergroundWeatherURL="http://api.wunderground.com/api/"+undergroundWeatherapiKey+"/hourly/q/"+latitude+","+longitude+".json";
  //console.log(undergroundWeatherURL);
  $.ajax({
    //makesure you change this when user inputs
    url: undergroundWeatherURL,
    method:"GET"
  })
  .done(function(response){
    var string;
    if(response.hourly_forecast[0]===" "){
      string="NO WEATHER AVAIL FOR THIS LOCATION";
    }
    else{
      var currentTime="Time: "+response.hourly_forecast[0].FCTTIME.pretty;
      var currentTempt="Temp: "+ response.hourly_forecast[0].temp.english+" °F";
      var currentCondition=response.hourly_forecast[0].wx;
      var icon="<img src='"+response.hourly_forecast[0].icon_url+"'>";
      //var currentPrecipitation="Precipitation: "+response.hourly_forecast[0].FCTTIME.humidity+" %";
      var currentHumidity="Humidity: "+response.hourly_forecast[0].humidity+" %";
      var currentWspd="Wind: "+response.hourly_forecast[0].wspd.english+" mph";
      string=currentTime+"</br>"+currentTempt+"</br>"+currentCondition+"</br>"+icon;
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
  initAutocomplete("startLocation");
  initAutocomplete("endLocation");
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
      origin=response.routes[0].legs[0].start_location;
      destination=response.routes[0].legs[0].end_location;
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
      var points=getPointsAtDistance((mileValue*1609.34),origin,destination);
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
          var markerPosition=this.getPosition().toUrlValue(6);
          var array=markerPosition.split(",");
          var makerPositionLat=array[0];
          var makerPositionLng=array[1];
          //CALLING THE WEATHER API AND PASSING LAT,LONG,AND MARKER
          undergroundWeatherAPI(makerPositionLat,makerPositionLng,clickedMarker);
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
  
  if(startLocation && endLocation !==" "){
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

function initAutocomplete(location) {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById(location)),
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

 