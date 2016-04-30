var map;

function initMap() {
  var dubLatlng = {lat: 53.340194, lng: -6.236333};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: dubLatlng
  });

  var marker = new google.maps.Marker({
    position: dubLatlng,
    map: map,
    title: 'Click to zoom'
  });

  map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);
  });

  marker.addListener('click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });  
}

// Calls the initMap() function when the page loads
window.addEventListener('load', initMap);
