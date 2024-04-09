let map;
let directionsService;
let directionsRenderer;
let jeepneyMarker;
let watchId;

function initMap() {
const options = {
center: { lat: 14.6599764, lng: 121.1130985 },
zoom: 12,
mapTypeControl: false,
zoomControl: false,
};

map = new google.maps.Map(document.getElementById("map_twentyFour"), options);
directionsService = new google.maps.DirectionsService();
directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
jeepneyMarker = new google.maps.Marker({
map: map,
title: "Jeepney",
icon: {
    url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png",
    scaledSize: new google.maps.Size(50, 50)
}
});

document.getElementById("startTrackingBtn").addEventListener("click", startTracking);
document.getElementById("stopTrackingBtn").addEventListener("click", stopTracking);

const route = {
  origin: { lat: 14.67826, lng: 121.12715, name: "Jasmin" },
  destination: { lat: 14.67455, lng: 121.13012, name: "St. John" },
  travelMode: 'DRIVING',
  waypoints: [
  { location: { lat: 14.67802, lng: 121.1276, name: "Thelma Store" } },
  { location: { lat: 14.67716, lng: 121.12868, name: "Ilang-Ilang" } },
  { location: { lat: 14.67687, lng: 121.12895, name: "St. Thomas" } },
  { location: { lat: 14.67654, lng: 121.12881, name: "St. Andrew" } },
  { location: { lat: 14.67579, lng: 121.12909, name: "St. Anthony" } },
  { location: { lat: 14.67541, lng: 121.12953, name: "St. Patrick" } },
]};

directionsService.route(route, (result, status) => {
if (status === 'OK') {
    directionsRenderer.setDirections(result);
} else {
    console.error("Directions request failed due to " + status);
}
});
}

function startTracking() {
if ('geolocation' in navigator) {
const options = {
    enableHighAccuracy: true, // Adjust accuracy as needed
    timeout: 3500,
};

watchId = navigator.geolocation.watchPosition(
    (position) => {
        const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        updateJeepneyPosition(userLocation);
    },
    (error) => {
        console.error("Error getting location:", error.message);
    },
);
} else {
console.error("Geolocation is not supported by this browser.");
}
}

function stopTracking() {
if (watchId) {
navigator.geolocation.clearWatch(watchId);
watchId = null;
}
}

function updateJeepneyPosition(position) {
jeepneyMarker.setPosition(position);
const jeepneyPositionElement = document.getElementById("jeepneyPosition");
if (jeepneyPositionElement) {
jeepneyMarker.setPosition(position);
jeepneyPositionElement.textContent = position.lat() + "," + position.lng();
} else {
console.warn("Element with ID 'jeepneyPosition' not found. Unable to update text content.");
}
console.log("User Location:", position.lat(), position.lng());
}        

function stopTracking() {
if (watchId) {
navigator.geolocation.clearWatch(watchId);
watchId = null;
}
}

const notificationDistance = 3;

function checkDistanceFromDestination(userLocation) {
  // Get the dropdown element
  const waypointSelect = document.getElementById("waypointSelect");

  // Extract the selected waypoint index from the dropdown value (assuming the value format indicates waypoint number)
  const selectedWaypointIndex = parseInt(waypointSelect.value.slice(-1)) - 1;

  // Check if a valid option is selected (handle potential errors)
  if (selectedWaypointIndex >= 0 && selectedWaypointIndex < route.waypoints.length) {
    const selectedWaypoint = route.waypoints[selectedWaypointIndex];

    // Calculate distance and trigger notification if near the waypoint
    const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, selectedWaypoint.location);
    if (distance <= notificationDistance) {
      const waypointName = selectedWaypoint.name || "Selected Waypoint";
      showWaypointNotification(waypointName);
    }
  } else {
    console.warn("Invalid waypoint selected or waypoints array might be empty.");
  }
}

function showWaypointNotification(waypointName) {
  if ('Notification' in window) {
      Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
              const message = `You are near ${waypointName}!`;
              new Notification(message);
          }
      });
  }
}
