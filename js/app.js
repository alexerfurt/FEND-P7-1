/////// Setting up location data ///////////
		
var initialLocations = [
	{
		name: 'Google Dublin',
		position: {lat: 53.3398681, lng: -6.2362238},
		address: 'Gordon House, Barrow St, Dublin 4'
	},{
		name: 'Herbstreet',
		position: {lat: 53.3443851, lng: -6.2376548},
		address: 'Hanover Quay, Grand Canal Dock, Dublin 2'
	},{
		name: 'Cafe H',
		position: {lat: 53.3435446, lng: -6.2388155},
		address: 'Grand Canal Dock, Dublin'
	},{
		name: 'The Old Spot',
		position: {lat: 53.3373286, lng: -6.2331933},
		address: '14 Bath Ave, Dublin 4'
	},{
		name: 'The Schoolhouse',
		position: {lat: 53.3374152, lng: -6.2394909},
		address: '2-8 Northumberland Rd, Dublin 4'
	},{
		name: 'The Ferryman',
		position: {lat: 53.3460145, lng: -6.2407869},
		address: '35 Sir John Rogerson Quay, Dublin'
	},{
		name: 'Mamma Mia',
		position: {lat: 53.339463, lng: -6.2436957},
		address: '2 Grattan St, Grand Canal Dock, Dublin 2'
	},{
		name: 'Osteria Lucio',
		position: {lat: 53.340093, lng: -6.239316},
		address: 'Grand Canal Quay, Grand Canal Dock, Dublin'
	},{
		name: "Juniors Paulie's Pizza",
		position: {lat: 53.3374246, lng: -6.2346821},
		address: '58 Grand Canal Street Upper, Dublin 4'
	},{
		name: "The Press Cafe",
		position: {lat: 53.3351826, lng: -6.2353551},
		address: 'The Square, Dublin Southside, Dublin'
	}
];

/////// Global variable and function set-up; loading Google Maps API ///////////

var Location = function (data) {
	this.name = data.name;
	this.position = data.position;
	this.address = data.address;
};

var map, marker;

// Adding error handling by checking if the Google Maps script has loaded yet before executing initMap function & applying ko bindings
function initMap() {
	if (typeof google === 'object' && typeof google.maps === 'object') {
		var dubLatlng = {lat: 53.3405001, lng: -6.2362238};
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 16,
			center: dubLatlng
		});
		
		ko.applyBindings(new ViewModel());
		
	} else {
		googleError();
	}
};

// Error handling function for Google Maps API
function googleError() {
	var errorMessage = '<div class="location-text"><h3>Ouch! Unfortunately, Google Maps API could not be loaded. Please check your internet connection and reload the page.</h3></div>';
  document.getElementById('map').innerHTML = errorMessage;
};

/////// ViewModel Code ///////////

var ViewModel = function () {
	
	var self = this;
	
	//Initialize first Knockout observables
	this.locationList = ko.observableArray([]);
	this.filter = ko.observable(); //property to store the filter query, which is an empty string in the beginning so not undefined in computed observable...
	
	// Filling locationList observable Array with the model (location data)
	initialLocations.forEach(function(locItem){
		self.locationList.push( new Location(locItem) );
	});
	
	var infoWindow = new google.maps.InfoWindow();
	
	//Adding a marker to every location in the locationList
	for (var i=0; i < self.locationList().length; i++) {
		
		marker = new google.maps.Marker({
			map: map,
			position: self.locationList()[i].position,
			animation: google.maps.Animation.DROP,
			title: self.locationList()[i].name,
			content: self.locationList()[i].address,
			draggable: true,
			visible: true,
		});
		
		marker.addListener('click', function() {
			createInfoWindow(this, infoWindow);

		});
		
		//Putting the created marker into locationList array
		self.locationList()[i].marker = marker; 
		  
	};
	
	//Adding function that creates an Infowindow everytime the respective marker is clicked or its locations on the list
	var createInfoWindow = function (marker, infoWindow) {
		if (infoWindow.marker != marker) {
			infoWindow.marker = marker;
			infoWindow.setContent('<div>' + '<h4>' + marker.title + '</h4>'  +  marker.content + '</div>');
			infoWindow.open(map, marker);
	  	  	setTimeout (function () {
	  	  	 	infoWindow.close(map, marker);
	  	  	}, 3000);
			  
			infoWindow.addListener('closeclick', function() {
				infoWindow.marker = null;
			});
		}
	};

	this.currentLocation = ko.observable( this.locationList()[0] );
	
	//Adding filter functionality
	this.filteredList = ko.computed(function() { //new location observable that includes only those locations that match with the filter query
		// also shows only markers of locations that are currently in the list
		var filter = this.filter();
		if (!filter) {
			//if there is no filter, then return the whole list
			return ko.utils.arrayFilter(this.locationList(), function(item) {
				//console.log(item);
				item.marker.setVisible(true);
				return true;
			});
		} else {
			
			//if there is a filter then use arrayFilter to shorten the locationList and show only markers for the shortend list
			return ko.utils.arrayFilter(this.locationList(), function(item) {
				if (item.name.toLowerCase().indexOf(filter) === 0) {
				     //console.log('item.marker: ' + item.marker);
				   item.marker.setVisible(true);
				   return true;
				 } else {
					item.marker.setVisible(false);
					return false;
				 }
			});
		}
	}, this);
	
	this.setMarker = function(clickedLocation) {
	  
	  clickedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
	  
	  setTimeout (function () {
	  	 clickedLocation.marker.setAnimation(null);
	  }, 750);
	  
	  //map.setCenter(clickedLocation.marker.position);
	  google.maps.event.trigger(clickedLocation.marker,'click');
	  	  
	};

};
