//----------------DIRECTIONS API---------------------

var duration;
var distance;

function directionsURL(startLocation, endLocation){
	var directionsKEY="AIzaSyAfNedlP-Xv-cl6ni8nbDMZD_red3X08WI";


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

var directionsDisplay;
var directionsService;
var map;

var infowindowDriving;

//map initial when nothing has been inputted
function initMap() {
	directionsService = new google.maps.DirectionsService();
  	directionsDisplay = new google.maps.DirectionsRenderer();
	var Tucson= new google.maps.LatLng(32.2217,-110.9265);
  	var mapOptions = {
   		zoom:4,
    	center:{lat: 32.2217, lng: -110.9265}
    
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

      
      var infowindow = new google.maps.InfoWindow();
      infowindow.setContent(response.routes[0].legs[0].distance.text + "<br>" + response.routes[0].legs[0].duration.text + " ");
      
      //the info window will be placed at the end of the route
      infowindow.setPosition(response.routes[0].legs[0].start_location);
     
      infowindow.open(map);
    }
  });
  
  
 
}




//-----------------geting usersinput--------------------
$("#runSearch").on("click",function(){

	var startLocation=$("#startLocation").val().trim();
	var endLocation=$("#startLocation").val().trim();

	

	if(startLocation&& endLocation !==" "){
		calcRoute();

	}


});