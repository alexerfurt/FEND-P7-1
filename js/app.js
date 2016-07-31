// Setting up location data
		
var initialLocations = [
	{
		name: 'Google Dublin',
		position: {lat: 53.3398681, lng: -6.2362238}
	},{
		name: 'Herbstreet',
		position: {lat: 53.3443851, lng: -6.2376548}
	},{
		name: 'Cafe H',
		position: {lat: 53.3435446, lng: -6.2388155}
	},{
		name: 'The Old Spot',
		position: {lat: 53.3373286, lng: -6.2331933}
	},{
		name: 'The Schoolhouse',
		position: {lat: 53.3374152, lng: -6.2394909}
	},{
		name: 'The Ferryman',
		position: {lat: 53.3460145, lng: -6.2407869}
	},{
		name: 'Mamma Mia',
		position: {lat: 53.339463, lng: -6.2436957}
	},{
		name: 'Osteria Lucio',
		position: {lat: 53.340093, lng: -6.239316}
	},{
		name: "Paulie's Pizza",
		position: {lat: 53.3374246, lng: -6.2346821}
	},{
		name: "The Press Cafe",
		position: {lat: 53.3351826, lng: -6.2353551}
	}
];

var Location = function (data) {
	this.name = data.name;
	this.position = data.position;
};

var map, marker;

function initMap() {
  var dubLatlng = {lat: 53.3398681, lng: -6.2362238};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: dubLatlng
  });

  ko.applyBindings(new ViewModel());  
}

// ViewModel Code

var ViewModel = function () {
	
	//Initialize Knockout observables
	var self = this;
	
	this.locationList = ko.observableArray([]);
	this.query = ko.observable('');
	
	initialLocations.forEach(function(locItem){
		self.locationList.push( new Location(locItem) );
	});
	
	var largeInfoWindow = new google.maps.InfoWindow();
	
	//Adding a marker to every location in the locationList
	for (var i=0; i < self.locationList().length; i++) {
		
		marker = new google.maps.Marker({
			map: map,
			position: self.locationList()[i].position,
			animation: google.maps.Animation.DROP,
			title: self.locationList()[i].name,
			content: '',
			draggable: true,
			visible: true,
		});
		
		marker.addListener('click', function() {
			//populateInfoWindow(this, largeInfoWindow); function not yet defined
			//toggleBounce(this); function not yet defined
			//map.setCenter(marker.getPosition());
		});
		
		//Putting the created marker in the locationList
		self.locationList()[i].marker = marker; 
		  
	};
	
	this.currentLocation = ko.observable( this.locationList()[0] );
	
	this.setMarker = function(clickedLocation) {
	  // go through each location and make each marker invisible
	  self.locationList().forEach(function (location){
	   location.marker.setVisible(false);
	  }); 
	  
	  //set the marker for the clicked location visible
	  clickedLocation.marker.setVisible(true);
	  
	  clickedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
	  setTimeout (function () {
	  	 clickedLocation.marker.setAnimation(null);
	  }, 1000);
	  
	  map.setCenter(clickedLocation.marker.position);
	  	  
	};
};




// Calls the initMap() function when the page loads
//window.addEventListener('load', initMap);
//}());