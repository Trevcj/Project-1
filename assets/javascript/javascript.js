//----------------DIRECTIONS API---------------------



function directionsURL(startLocation, endLocation){
	var directionsKEY="AIzaSyAIq7MXbfsfyh18by7GqjrtP7xKeFmR-e8";


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
    
	};
 
	map = new google.maps.Map(document.getElementById("mapBody"), mapOptions);
	directionsDisplay.setMap(map);

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
	var endLocation=$("#startLocation").val().trim();

	

	if(startLocation&& endLocation !==" "){
		calcRoute();

	}
	//console.log(directionsURL("tucson,arizona","yuma,arizona"));


});


    

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