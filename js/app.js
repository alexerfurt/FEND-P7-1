/*global ko, Router */
//(function () {
	
var initialLocations = [
	{
		name: 'Google Dublin',
		position: {lat: 53.340194, lng: -6.236333}
	},{
		name: 'Herbstreet',
		position: {lat: 53.3402679, lng: -6.2412132}
	},{
		name: 'Cafe H',
		position: {lat: 53.3419097, lng: -6.2400052}
	},{
		name: 'The Old Spot',
		position: {lat: 53.3405771, lng: -6.2413152}
	},{
		name: 'The Schoolhouse',
		position: {lat: 53.3405337, lng: -6.2412717}
	},{
		name: 'The Ferryman',
		position: {lat: 53.3428969, lng: -6.2419581}
	},{
		name: 'Mamma Mia',
		position: {lat: 53.3399306, lng: -6.2422802}
	},{
		name: 'Osteria Lucio',
		position: {lat: 53.3400085, lng: -6.2405306}
	},{
		name: "Paulie's Pizza",
		position: {lat: 53.3397954, lng: -6.2394496}
	}
];

var Location = function (data) {
	this.name = ko.observable(data.name);
}


var ViewModel = function () {
	var that = this;
	
	this.locationList = ko.observableArray([]);
	
	initialLocations.forEach(function(locItem){
		that.locationList.push( new Location(locItem) );
	});
	
	this.currentLocation = ko.observable( this.locationList()[0] );
	
	this.setLocation = function(clickedLocation) {
		that.currentLocation(clickedLocation);
	};
	
};

ko.applyBindings(new ViewModel());

var map;

function initMap() {
  var dubLatlng = {lat: 53.340194, lng: -6.236333};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: dubLatlng
  });

  var marker = new google.maps.Marker({
    position: dubLatlng,
    map: map,
    title: 'Click to zoom'
  });

  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      // your code goes here!
      infoWindow.open(map, marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  marker.addListener('click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });  
}

// Calls the initMap() function when the page loads
//window.addEventListener('load', initMap);
//}());