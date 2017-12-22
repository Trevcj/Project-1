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
var string="";
//var durationDays=0;
var originLat;
var originLng;
var mileValue;

function waypointDuration(toWaypointdurationString,currentTime){
  var toWaypointdurationArray=toWaypointdurationString.split(" ");
  var arrayLength=toWaypointdurationArray.length;
  var toWaypointdurationHr=0;
  var toWaypointdurationMin=0;
//console.log(toWaypointdurationArray);
  switch (arrayLength){
    case 2:
      durationDays=0;
      toWaypointdurationMin=parseInt(toWaypointdurationArray[0]);
      if(toWaypointdurationMin>=30){
        toWaypointdurationHr=1;
        toWaypointdurationMin=0;
//        console.log("case2")
      }
      else{
        durationDays=0;
        toWaypointdurationHr=0;
//        console.log("case2 else")

      }
    break;
    case 4:
    
      if(toWaypointdurationArray[1]==="hours"||toWaypointdurationArray[1]==="hour"){
        toWaypointdurationHr=parseInt(toWaypointdurationArray[0]);
        toWaypointdurationMin=parseInt(toWaypointdurationArray[2]);
        durationDays=0;
//        console.log("case4 nodays");
      }
      else{
        toWaypointdurationHr=parseInt(toWaypointdurationArray[2]);
        toWaypointdurationMin=0;
        var durationDays=parseInt(toWaypointdurationArray[0]);
        //console.log("case4");
       }
    break;
  }
  //console.log("Hours:" + toWaypointdurationHr);
  //console.log("Minutes: " + toWaypointdurationMin);
  //console.log("Days: " + durationDays);
 // console.log("currentTime going first function "+currentTime);

  return calcWaypointTime(toWaypointdurationMin,toWaypointdurationHr,currentTime,durationDays);
   

}
function calcWaypointTime(toWaypointdurationMin,toWaypointdurationHr,currentTime,durationDays){

//console.log("currentTime coming in second function "+currentTime);
  var localPassTime=0;
//  console.log("after setting to zero"+waypointPasstime);
  if(durationDays>0){
    localPassTime=toWaypointdurationHr;
   // console.log("takes days to get here");
    
  }
  else{
    if (toWaypointdurationMin>=30){
      toWaypointdurationHr=toWaypointdurationHr+1;
    }
    }
    
    localPassTime=currentTime+toWaypointdurationHr;
    //console.log("toWayPointdurationHr "+toWaypointdurationHr)
    //console.log("currentTimeadded"+currentTime);
    //console.log("resulting of addition "+ localPassTime);
    //console.log("durationDays"+durationDays);
//    console.log("toWaypointdurationHradded"+toWaypointdurationHr);
//    console.log("waypointPasstimeafter adding"+waypointPasstime);
    if (localPassTime>=24){

        localPassTime=(localPassTime-24);
        //CHECK FOR WHEN THE HRS GO AVOVE
        durationDays++;
 //       console.log("hr is more than 24");
 //       console.log(durationDays);
    }
    
     
  //console.log("sending to underweatherEND" +localPassTime);
  //console.log("durationDaysEND"+durationDays);
  var passtimedurationDays=[];
  passtimedurationDays.push(localPassTime);
  passtimedurationDays.push(durationDays);
  //return localPassTime;
  return passtimedurationDays;
//  console.log("when leaving the function to api"+waypointPasstime);
}
//----------------DIRECTIONS API---------------------
function directionsAPI(originLat,originLng,markerPositionLat,markerPositionLng){
  var directionsKEY="AIzaSyAfNedlP-Xv-cl6ni8nbDMZD_red3X08WI";
  //trevor's backup AIzaSyAIq7MXbfsfyh18by7GqjrtP7xKeFmR-e8
  var directionsURL="https://cors-anywhere.herokuapp.com/" +"https://maps.googleapis.com/maps/api/directions/json?origin="+originLat+","+originLng+"&destination="+markerPositionLat+","+markerPositionLng+"&key="+directionsKEY;
//  console.log(directionsURL);
  return $.ajax({
    url: directionsURL,
    method:"GET"
  });
}
// "https://cors-anywhere.herokuapp.com/" +

//------------------WEATHER API-----------------------------------

function undergroundWeatherAPI(latitude,longitude,marker,passTime,durationDays,currentDayoftheYear){


  var undergroundWeatherapiKey="b26eea70cef99b97";
  var undergroundWeatherURL="https://api.wunderground.com/api/"+undergroundWeatherapiKey+"/hourly10day/q/"+latitude+","+longitude+".json";
  console.log(undergroundWeatherURL);
  $.ajax({

    //makesure you change this when user inputs
    url: undergroundWeatherURL,
    method:"GET"
  })
  .done(function(response){ 
    var time;
    var weekDay;
    var temp;
    var condition;
    var icon;
    var responseHrinterger;
    var currentDaypass;
    var day;
    var dayWeatherArray=[];
    // console.log("WeatdurationDays"+durationDays);
    // console.log("waypointsPasstime"+waypointPasstime);
    if(response.hourly_forecast[0]===" "){
      string="NO WEATHER AVAIL FOR THIS LOCATION";
    }
    else{

      if(durationDays===0){
        for(var i=0;i<response.hourly_forecast.length;i++){
          responseHrinterger=parseInt(response.hourly_forecast[i].FCTTIME.hour);
          if(responseHrinterger===passTime){
            time=response.hourly_forecast[i].FCTTIME.weekday_name;
            weekDay=response.hourly_forecast[i].FCTTIME.civil;
            temp="Temp: "+ response.hourly_forecast[i].temp.english+" °F";
            condition=response.hourly_forecast[i].wx;
            icon="<img src='"+response.hourly_forecast[i].icon_url+"'>";
            break;
          }
        }
      }
      else{
          //console.log("currentDayoftheYearb4addition "+ currentDayoftheYear);
          //console.log("durationDaysb4addition "+durationDays);
         // console.log("currentDaypass b4 addition "+currentDaypass);
        currentDaypass=currentDayoftheYear+durationDays;
        //console.log("currentDayoftheYearafteraddition "+ currentDayoftheYear);
        //console.log("durationDaysafteraddition "+durationDays);
        //console.log("currentDaypass after addition "+currentDaypass);
        //SECOND ATTEMPT IDEA
        for(var i=0;i<response.hourly_forecast.length;i++){
          day=parseInt(response.hourly_forecast[i].FCTTIME.yday);
          responseHrinterger=parseInt(response.hourly_forecast[i].FCTTIME.hour);
          if(responseHrinterger===passTime&&day===currentDaypass){
            time=response.hourly_forecast[i].FCTTIME.weekday_name;
            weekDay=response.hourly_forecast[i].FCTTIME.civil;
            temp="Temp: "+ response.hourly_forecast[i].temp.english+" °F";
            condition=response.hourly_forecast[i].wx;
            icon="<img src='"+response.hourly_forecast[i].icon_url+"'>";

          }
        }
      }
      string=string+"</br>"+weekDay+" "+time+"</br>"+icon+temp+"</br>"+condition;

      //OPENING WINDOW ABOVE MARKER WHEN CLICKED
      infowindowMarker.setContent(string);
      infowindowMarker.open(map,marker);
      
    }
  });
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
      originObject=response.routes[0].legs[0].start_location;
      originLat=originObject.lat();
      originLng=originObject.lng();
      destinationObject=response.routes[0].legs[0].end_location;
      
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
      //REMOVED THE POLYLINE CREATED BY GOOGLE DIRECTIONS
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
        if (i===0) {
          var marker = new google.maps.Marker({
            map:map,
            animation: google.maps.Animation.DROP,
            icon: "https://maps.google.com/mapfiles/arrowshadow.png",
            position: points[0],
            title: "Starting Location"

          });
        }
        else{
        var marker = new google.maps.Marker({
          map:map,
          animation: google.maps.Animation.DROP,
          position:points[i],
          title:"Location" +(i+1)
        });
      }
        //this is where we will display the weather Conditions
        marker.addListener('click', function(){
            var currentTime;
            var currentDayoftheYear;
          var startMarker="false";
          var clickedMarker=this;
          var markerPositionObj=this.getPosition();
          var markerPosition=this.getPosition().toUrlValue(6);
          var array=markerPosition.split(",");
          var makerPositionLat=array[0];
          var makerPositionLng=array[1];
          //resetting the variables used
          string="";
          //get the currentTime at the given marker by using the underWeatherAPi
          var undergroundWeatherapiKey="b26eea70cef99b97";
          var undergroundWeatherURL="https://api.wunderground.com/api/"+undergroundWeatherapiKey+"/hourly10day/q/"+makerPositionLat+","+makerPositionLng+".json";
          console.log("from divs"+undergroundWeatherURL);
    
          $.ajax({
    
            //makesure you change this when user inputs
            url: undergroundWeatherURL,
            method:"GET"
          })
          .done(function(response){
           
         currentTime=parseInt(response.hourly_forecast[0].FCTTIME.hour);
         currentDayoftheYear=parseInt(response.hourly_forecast[0].FCTTIME.yday);;
         //console.log("currentDayoftheYear from  response "+currentDayoftheYear);
        //console.log("currentTime= response "+currentTime);
          //we want the tripduration and thewaypoint name
          directionsAPI(originLat,originLng,makerPositionLat,makerPositionLng)
          .done(function(response){
            
                var waypointAddress=response.routes[0].legs[0].end_address;
                var toWaypointdurationString=response.routes[0].legs[0].duration.text;
                //determine if waypoint is mins/hrs/days
                //array of passtime and durationDays
                var passTime = waypointDuration(toWaypointdurationString,currentTime);
                var passTimefromArray=passTime[0];
                var durationDaysfromArray=passTime[1];
               
                string=string+"</br>"+"<strong>"+waypointAddress+"</strong>"+"</br>"+"<font size='2' color='red'><i>"+toWaypointdurationString+"</i></font>";

                //console.log("currentDayoftheYear before leavingtounderweatherfnction "+currentDayoftheYear);
                //CALLING THE WEATHER API AND PASSING LAT,LONG,AND MARKER
              undergroundWeatherAPI(makerPositionLat,makerPositionLng,clickedMarker,passTimefromArray,durationDaysfromArray,currentDayoftheYear);
          
              });
        });
          
          //resetting the variables used
          //string="";
          
        });
        markers.push(marker);
      } 
      }detailedWeather();
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
  mileValue=$("#mileValue option:selected").val()
  //clear detailed weather div when you start a new search
  $(".list-group").empty();

  if(origin&& destination!==" "){

    calcRoute();
  }
});



//detailed weather div version 2
//this is where we will display the weather Conditions in the bottom div
function detailedWeather(){
  var detailPoints = getPointsAtDistance((mileValue*1609.34),originObject,destinationObject);

  

  // var makeWeatherDiv = function(lat, lng) {

  //var detailedWeatherDiv = $('<div>').text('Loading...'); 

  // };

  
  for (var i = 0; i < detailPoints.length; i++) {
    //console.log(detailPoints[i].lat());
    //console.log(detailPoints[i].lng());


    let detailPointLat= detailPoints[i].lat();
    let detailPointLng= detailPoints[i].lng();
    let weatherListItem = $("<li class='list-group-item' id='item'>");

    $(".list-group").append(weatherListItem);

    //console.log("Coordinates in: " + detailPointLat + "," + detailPointLng);
    var undergroundWeatherapiKey="b26eea70cef99b97";
    var undergroundWeatherURL="https://api.wunderground.com/api/"+undergroundWeatherapiKey+"/hourly10day/q/"+detailPointLat+","+detailPointLng+".json";
    // console.log(undergroundWeatherURL);

    $.ajax({

      //makesure you change this when user inputs
      url: undergroundWeatherURL,
      method:"GET"
    })
    .done(function(response){
     
      currentTime=parseInt(response.hourly_forecast[0].FCTTIME.hour);
      currentDayoftheYear=parseInt(response.hourly_forecast[0].FCTTIME.yday);
      //console.log("currentDayoftheYear from  response "+currentDayoftheYear);
      //console.log("currentTime= response "+currentTime);

      //Reusing function to get duration and location data
      directionsAPI(originLat,originLng,detailPointLat,detailPointLng)
      .done(function(response){

        var waypointAddress=response.routes[0].legs[0].end_address;
        var toWaypointdurationString=response.routes[0].legs[0].duration.text;
       
        //determine if waypoint is mins/hrs/days
        //waypointpasstime and duration days stored as an array
        var passTimedurationDays = waypointDuration(toWaypointdurationString,currentTime);
        var durationDays=passTimedurationDays[1];
        var waypointPassTime=passTimedurationDays[0];

        //console.log("array from function" +passTimedurationDays);
        //create location Title for each in the div

        var detailedLocation= $("<div>").text(waypointAddress).addClass("detailLocation");
        var durationDisplay=$("<div>").text(toWaypointdurationString).addClass("duration").attr("id","duration-"+i);

        //console.log("Coordinates out: " + waypointLocationLat + "," + waypointLocationLng);

        //Modifications made to the WEATHER API to elivate the need for a marker parameter and output data to div instead of info window
        var undergroundWeatherapiKey="b26eea70cef99b97";
        var undergroundWeatherURL="https://api.wunderground.com/api/"+undergroundWeatherapiKey+"/hourly10day/q/"+detailPointLat+","+detailPointLng+".json";
        //console.log(undergroundWeatherURL);
        $.ajax({

        //makesure you change this when user inputs
        url: undergroundWeatherURL,
        method:"GET"
        })
        .done(function(response){
          var time;
          var weekDay;
          var temp;
          var condition;
          var icon;
          var responseHrinterger;
          //var yday;
          var day;
          var humidity;
          var wind;
          var currentDaypass;
          var array=[];
       
          // console.log("WeatdurationDays"+durationDays);
         // console.log("waypointsPasstime"+waypointPasstime);
          if(response.hourly_forecast[0]===" "){
            string="NO WHEATHER AVAIL FOR THIS LOCATION";
          }            
          else{
            if(durationDays===0){
              for(var i=0;i<response.hourly_forecast.length;i++){
                responseHrinterger=parseInt(response.hourly_forecast[i].FCTTIME.hour);
                //console.log(responseHrinterger);
                //console.log(waypointPassTime);
                //console.log(responseHrinterger)
                //console.log(waypointPassTime)
                if(responseHrinterger===waypointPassTime){
                  time= $("<div>").text("Time: " + response.hourly_forecast[i].FCTTIME.weekday_name);
                  weekDay= $("<div>").text(response.hourly_forecast[i].FCTTIME.civil);
                  temp= $("<div>").text("Temp: "+ response.hourly_forecast[i].temp.english+" °F");
                  condition= $("<div>").text(response.hourly_forecast[i].wx);
                  icon= $("<div>").html("<img src='"+response.hourly_forecast[i].icon_url+"'>");
                  humidity= $("<div>").text("Humidity: "+response.hourly_forecast[i].humidity+" %");
                  wind= $("<div>").text("Wind: "+response.hourly_forecast[i].wspd.english+" mph");
                  break;
                }
              }
            }
            else{
              currentDaypass=currentDayoftheYear+durationDays;
              //console.log(currentDaypass);
              //console.log(currentDayoftheYear);
              //console.log(durationDays);
              //console.log("yday"+yday);
              //SECOND ATTEMPT IDEA
              for(var j=0;j<response.hourly_forecast.length;j++){
                day=parseInt(response.hourly_forecast[j].FCTTIME.yday);
                /*if(day===currentDaypass){
                  var object={
                    time:$("<div>").text("Arrival Day: " + response.hourly_forecast[j].FCTTIME.weekday_name),
                    week_day:$("<div>").text(response.hourly_forecast[j].FCTTIME.civil),
                    temp: $("<div>").text("Temp: "+ response.hourly_forecast[j].temp.english+" °F")
                  }
                  array.push(object);
                }
              }*/
                responseHrinterger=parseInt(response.hourly_forecast[j].FCTTIME.hour);
                console.log(responseHrinterger);
                console.log(waypointPassTime);
                console.log(day);
                console.log(currentDayoftheYear);

                if(responseHrinterger===waypointPassTime&&day===currentDaypass){
                  //console.log(day);
                  console.log('yes')

                  time= $("<div>").text("Arrival Day: " + response.hourly_forecast[j].FCTTIME.weekday_name);
                  weekDay= $("<div>").text(response.hourly_forecast[j].FCTTIME.civil);
                  temp= $("<div>").text("Temp: "+ response.hourly_forecast[j].temp.english+" °F");
                  condition= $("<div>").text(response.hourly_forecast[j].wx);
                  icon= $("<div>").html("<img src='"+response.hourly_forecast[j].icon_url+"'>");
                  humidity= $("<div>").text("Humidity: "+response.hourly_forecast[j].humidity+" %");
                  wind= $("<div>").text("Wind: "+response.hourly_forecast[j].wspd.english+" mph");
                } else {
                  console.log('no')
                }
              }
            }
            
            //Attach lines of weather info to weather item div
            weatherListItem.append(detailedLocation);
            weatherListItem.append(durationDisplay);
            weatherListItem.append(time);
            weatherListItem.append(weekDay);
            weatherListItem.append(icon);
            weatherListItem.append(temp);
            weatherListItem.append(condition);
            weatherListItem.append(wind);
            weatherListItem.append(humidity);
            
            //output detailed wether div to detailed weather container
          }
        });
      });        
    });
  }
}


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
};
