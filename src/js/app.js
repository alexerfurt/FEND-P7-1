/////// Setting up global variables and location data ///////////
var map, createInfoWindow, infowindow;

var initialLocations = [{
    name: 'Herbstreet',
    position: {
        lat: 53.3443851,
        lng: -6.2376548
    },
    address: 'Hanover Quay,Grand Canal Dock, Dublin 2',
    yelpID: 'herbstreet-dublin-2'
}, {
    name: 'Cafe Bar H',
    position: {
        lat: 53.3435446,
        lng: -6.2388155
    },
    address: 'Grand Canal Dock, Dublin 2',
    yelpID: "cafe-bar-h-dublin-2"
}, {
    name: 'The Old Spot',
    position: {
        lat: 53.3373286,
        lng: -6.2331933
    },
    address: '14 Bath Ave, Dublin 4',
    yelpID: "the-old-spot-dublin"
}, {
    name: 'The Schoolhouse Bar & Restaurant',
    position: {
        lat: 53.3374152,
        lng: -6.2394909
    },
    address: '2-8 Northumberland Rd, Dublin 4',
    yelpID: "the-schoolhouse-bar-and-restaurant-dublin"
}, {
    name: 'The Ferryman',
    position: {
        lat: 53.3460145,
        lng: -6.2407869
    },
    address: '35 Sir John Rogerson Quay, Dublin 2',
    yelpID: 'ferryman-town-house-dublin'
}, {
    name: 'Mamma Mia',
    position: {
        lat: 53.339463,
        lng: -6.2436957
    },
    address: '2 Grattan St, Dublin 2',
    yelpID: "mamma-mia-dublin-2"
}, {
    name: 'Osteria Lucio',
    position: {
        lat: 53.340093,
        lng: -6.239316
    },
    address: 'Clanwilliam terrace, Grand Canal Quay, Dublin 2',
    yelpID: 'osteria-lucio-dublin'
}, {
    name: "Juniors Paulies Pizza",
    position: {
        lat: 53.3374246,
        lng: -6.2346821
    },
    address: '58 Grand Canal Street Upper, Dublin 4',
    yelpID: "paulies-pizza-dublin"
}, {
    name: "The Press Cafe",
    position: {
        lat: 53.3351826,
        lng: -6.2353551
    },
    address: 'The Square, Dublin Southside, Dublin 4',
    yelpID: "press-cafe-dublin"
}];

var Location = function(data) { //Location class
    var that = this;
    this.name = data.name;
    this.position = data.position;
    this.address = data.address;
    this.yelpID = data.yelpID;
    this.marker = new google.maps.Marker({ //Adding a marker to Location class
        map: map,
        position: this.position,
        animation: google.maps.Animation.DROP,
        title: this.name,
        content: this.address,
        draggable: true,
        visible: true,
    });

    //Adding event listener to each marker
    this.marker.addListener('click', function() {
        Location.prototype.setMarker(that);
        Location.prototype.getYelpData(that);
    });
};

Location.prototype.setMarker = function(loc) { //Adding function for bounce animation of pins when clicked
    var clickedLocation = loc;
    clickedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);

    setTimeout(function() {
        clickedLocation.marker.setAnimation(null);
    }, 750);
};

Location.prototype.getYelpData = function(loc) { //Adding function to call Yelp API for some location data

    var clickedLocation = loc;

    var YELP_KEY = "QgKzDi6crlpMCdWqbO6dFA",
        YELP_TOKEN = "3RF38ZKFoQAKGL0G1K2VwkFRZ1DAz-mk",
        YELP_KEY_SECRET = "f8fSNbZvOseIXYlrsqbKqPlgYqo",
        YELP_TOKEN_SECRET = "WwALE3bHBsJNq3uRiX_TAPMOg9U",
        business_id = clickedLocation.yelpID;

    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }

    var yelp_url = 'http://api.yelp.com/v2/business/' + business_id;

    var parameters = {
        oauth_consumer_key: YELP_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb',
        id: business_id
    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters,
        YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

    $.ajax({
            url: yelp_url,
            data: parameters,
            cache: true,
            dataType: 'jsonp',
            jsonpCallback: 'cb',
            success: function(results) {
                //Putting results into the businesses object of locationListArray.		          
                clickedLocation.businesses = results;
                //Function to create an infowindow is called which gets now the clicked location with all the necessary information
                createInfoWindow(clickedLocation, infoWindow);
            }
        })
        .fail(function() { // Sends error message to the user
            alert("An error occurred: Yelp API call failed! Sorry about that. Please check your internet connection or try it again later.");
        });
};

/////// Google Maps API ///////////

//Adding error handling by checking if the Google Maps script has loaded yet before executing initMap function & applying ko bindings
function initMap() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        var dubLatlng = {
            lat: 53.3405001,
            lng: -6.2362238
        };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: dubLatlng
        });

        ko.applyBindings(new ViewModel());

    } else {
        googleError();
    }
}

// Error handling function for Google Maps API
function googleError() {
    var errorMessage = '<div class="location-text"><h3>Ouch! Unfortunately, Google Maps API could not be loaded. Please check your internet connection and reload the page.</h3></div>';
    document.getElementById('map').innerHTML = errorMessage;
}

/////// ViewModel Code ///////////

var ViewModel = function() {

    var self = this;

    //Initialize first Knockout observables
    this.locationList = ko.observableArray([]);
    this.filter = ko.observable(''); //property to store the filter query, which is an empty string in the beginning so not undefined in computed observable...

    // Filling locationList observable Array with the model (location data)
    initialLocations.forEach(function(locItem) {
        self.locationList.push(new Location(locItem));
    });

    infoWindow = new google.maps.InfoWindow();

    //Adding function that creates an Infowindow everytime the respective marker is clicked or its locations on the list. Infowindo includes name and address data from the model as well as phone number and customer ratings from the Yelp API
    createInfoWindow = function(location, infoWindow) {
        if (infoWindow.marker != location.marker) {
            infoWindow.marker = location.marker;
            infoWindow.setContent('<div>' + '<h4>' + location.marker.title + '</h4>' + location.marker.content + '</br>' + 'Phone:  ' + location.businesses.phone + '</br>' + '</br>' + 'Yelp-Rating:  ' +
                location.businesses.rating + '   ' + ' <img src = "' + location.businesses.rating_img_url + '"/>' + ' ' + location.businesses.review_count + ' Reviews' + '</br>' + '</br>' + 'Yelp-Review:  ' + location.businesses.reviews[0].excerpt + '</div>');
            infoWindow.open(map, location.marker);
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });
        }
    };

    this.currentLocation = function() {
        Location.prototype.setMarker();
        Location.prototype.getYelpData();
    };

    //Adding filter functionality
    this.filteredList = ko.computed(function() { //new location observable that includes only those locations that match with the filter query
        // uses arrayFilter to shorten the locationList and show only markers for the shortend list
        var filter = this.filter().toLowerCase();

        return ko.utils.arrayFilter(this.locationList(), function(item) {
            // check if string is present, will be true or false
            var matches = item.name.toLowerCase().indexOf(filter) === 0;
            item.marker.setVisible(matches);
            return matches;
        });
    }, this);

};