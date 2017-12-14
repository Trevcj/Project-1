//global variables
var durationTrip;
var distanceTrip;
var directionsDisplay;
var directionsService;
var map;
var polyline;
var path;
var infowindowMarker = new google.maps.InfoWindow();
var markers=[];


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
  console.log(undergroundWeatherURL);
  $.ajax({
    //makesure you change this when user inputs
    url: undergroundWeatherURL,
    method:"GET"
  })
  .done(function(response){
    var string;
   
    if(response.hourly_forecast[0]===" "){
      string="NO WHEATHER AVAIL FOR THIS LOCATION";
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
      //directionsDisplay.setDirections(response);
      polyline.setPath([]);
      var bounds=new google.maps.LatLngBounds();
      startLocationObj=new Object();
      endLocationObj=new Object();
     

      //setting the route variable equals to routes which contains bounds northeast and southeast from the directions API
      var route=response.routes[0];

      // For each route, get an array that contains LatLngs that represent an approximate (smoothed) path of the resulting directions.
      //var path=response.routes[0].overview_path;

      //array of onjects with the steps for everywaypoint
      var legs=response.routes[0].legs;

      //assigning the polyline its path based on the directions line

      for(var i=0;i<legs.length;i++){
        if(i===0){
          startLocationObj.latlng=legs[i].start_location;
          startLocation.address=legs[i].start_address;
          marker = createMarker(legs[i].start_location, "start", legs[i].start_address, "green");
          }

          //icreateMarker(legs[i].start_location, "start", legs[i].start_address, "green");
        
        endLocationObj.latlng=legs[i].end_location;
        endLocation.address=legs[i].end_address;
        var steps=legs[i].steps;
        for(var j=0;j<steps.length;j++){
          var nextSegment=steps[j].path;
        
          for(var k=0;k<nextSegment.length;k++){
            polyline.getPath().push(nextSegment[k]);
            bounds.extend(nextSegment[k]);
          }
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
      var points=getPointsAtDistance(mileValue*1609.34);

    

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

function createMarker(latlng, label, html, color) {
  var contentString = '<b>' + label +"whats myname" +'</b><br>' + html;
  
  var marker = new google.maps.Marker({
    position: latlng, 
    map: map,
    icon: getMarkerImage(color),
    title: label,
    zIndex: Math.round(latlng.lat() * -100000) << 5
  });
  marker.myname = label;
  markers.push(marker);
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });
  return marker;
}

//had to turn this to a function from eopoly.js because it was not being read

function getPointsAtDistance(meters){
  var next = meters;
  var points = [];
  // some awkward special cases
  if (meters <= 0){ 
    return points;
  }
  var dist=0;
  var olddist=0;
  for (var i=1; (i < polyline.getPath().getLength()); i++) {
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
  return points;
}
var markericons=new Array();
markericons["blue"]={url: "http://maps.google.com/mapfiles/ms/micons/red.png"};

function getMarkerImage(iconColor) {
   if ((typeof(iconColor)=="undefined") || (iconColor==null)) { 
      iconColor = "red"; 
   }
   if (!markericons[iconColor]) {
      markericons[iconColor] = {url:"http://maps.google.com/mapfiles/ms/micons/"+ iconColor +".png"};
   } 
   return markericons[iconColor];
}

google.maps.event.addDomListener(window, 'load', initMap);

//-----------------geting usersinput--------------------
$("#runSearch").on("click",function(){

  var origin=$("#startLocation").val().trim();
  var destination=$("#startLocation").val().trim();
  
  if(startLocation&& endLocation !==" "){
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