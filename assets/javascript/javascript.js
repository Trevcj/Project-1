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

    


    
  
  })
}


//------------------WEATHER API-----------------------------------


function undergroundWeatherURL(longitude,latitude){

  var undergroundWeatherapiKey="b26eea70cef99b97";

  var undergroundWeatherURL="http://api.wunderground.com/api/"+undergroundWeatherapiKey+"/hourly/q/"+longitude+","+latitude+".json";

  return undergroundWeatherURL;
}

function getUndergroundweatherAPI(){

  $.ajax({
    //makesure you change this when user inputs
    url: undergroundWeatherURL(32.2217,-110.9265),
    method:"GET"
  })
  .done(function(response){

    //checking to see if it returns values
    //console.log(response.hourly_forecast[0].FCTTIME.hour);
  
  })
}

//----------------DISPLAY DIRECTIONS-------------------

var durationTrip;
var distanceTrip;
var directionsDisplay;
var directionsService;
var map;
var polyline;
var path;
var infowindow = new google.maps.InfoWindow();
var markers=[];




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

        marker.addListener('click', function(){
         var contentString = this.getTitle()+"<br>"+this.getPosition().toUrlValue(6);
        infowindow.setContent(contentString);
        infowindow.open(map, this);

        });
        
        marker.addListener("click",function(){


          openInfowindow(this);

        });
        
        markers.push(marker);
      }


      /*durationTrip=response.routes[0].legs[0].duration.text;
      distanceTrip=response.routes[0].legs[0].distance.text;*/
    }
  }); 
}

function createMarker(latlng, label, html, color) {
  var contentString = '<b>' + label + '</b><br>' + html;
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
function openInfowindow() {
    var contentString = this.getTitle()+"<br>"+this.getPosition().toUrlValue(6);
    infowindow.setContent(contentString);
    infowindow.open(map, this);
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
  //console.log(directionsURL("tucson,arizona","yuma,arizona"));


});



