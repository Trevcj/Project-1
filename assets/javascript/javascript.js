//----------------DIRECTIONS API---------------------



function directionsURL(startLocation, endLocation){
	var directionsKEY = "AIzaSyBPziLCLR3gj6MHvDJjQFrNrKdz6qOdV9c";


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
var startLat;
var endLat;
var startLong;
var endLong;
var durationTrip;
var distanceTrip;
var directionsDisplay;
var directionsService;
var map;
//var poly;
//var path;
var infowindowDriving;




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
	
}


//calculates the route
function calcRoute() {
 
  var request = {
    origin: $("#startLocation").val(),
    destination: $("#endLocation").val(),
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
	}
  });


  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      durationTrip=response.routes[0].legs[0].duration.text;
	  distanceTrip=response.routes[0].legs[0].distance.text;
	  startLat = response.routes[0].legs[0].start_location.lat();
	  startLong = response.routes[0].legs[0].start_location.lng();
	  endLat = response.routes[0].legs[0].end_location.lat();
	  endLong = response.routes[0].legs[0].end_location.lng();
	  console.log(startLat, startLong, endLat, endLong);
	  console.log(response);


      
      var infowindow = new google.maps.InfoWindow();
      infowindow.setContent( "<strong>"+durationTrip+"</strong>"+ "<br>" + distanceTrip + " ");
      
      //the info window will be placed at the end of the route
      infowindow.setPosition(response.routes[0].legs[0].end_location);
     
      infowindow.open(map);
	}
	

  });
  

 
}





//-----------------geting usersinput--------------------
$("#runSearch").on("click",function(){

	var startLocation=$("#startLocation").val().trim();
	var endLocation=$("#endLocation").val().trim();

	

	if(startLocation && endLocation !==" "){
		calcRoute();

	}
	//console.log(directionsURL("tucson,arizona","yuma,arizona"));


});