//----------------GOOGLE DIRECTIONS---------------------
var directionsAPI



//------------------WEATHER API-----------------------------------

var geoCodeAPI;
function undergroundWeatherURL(longitude,latitude){

	var undergroundWeatherapiKey="b26eea70cef99b97";

	var undergroundWeatherURL="http://api.wunderground.com/api/"+undergroundWeatherapiKey+"/hourly/q/"+longitude+","+latitude+".json";

	return undergroundWeatherURL;
}

function getundergroundWeatherAPI(){

	$.ajax({
		url: undergroundWeatherURL(32.2217,-110.9265),
		method:"GET"
	})
	.done(function(response){
		
		return response;
	
	})
}
var undergroundWeatherAPI=getundergroundWeatherAPI();

undergroundWeatherAPI.

console.log( undergroundWeatherURL(32.2217,-110.9265));






