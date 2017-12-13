
//--------------GOOGLE MAPS ---------------------
   var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
      }


//----------------DIRECTIONS API---------------------
var startingLocation="Yuma, Arizona";
var endingLocation="Tucson, Arizona";

function directionsURL(startingLocation, endingLocation){
	var directionsKEY="AIzaSyAfNedlP-Xv-cl6ni8nbDMZD_red3X08WI";


	var directionsURL="https://maps.googleapis.com/maps/api/directions/json?origin="+startingLocation+"&destination="+endingLocation+"&key="+directionsKEY;
	return directionsURL;

}

function getDirectionsAPI(){

	$.ajax({
		url: directionsURL(startingLocation,endingLocation),
		method:"GET"
	})
	.done(function(response){
		
		console.log(response.routes[0].legs.distance.text);
	
	})
}

getDirectionsAPI();

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

//makesure you call the funtion to display 
getUndergroundweatherAPI();






