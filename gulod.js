let map;
let directionsService;
let directionsRenderer;
let jeepneyMarker;
let watchId;
let notificationDistance = 50;

const waypointSelect = document.getElementById("waypointSelect");
waypointSelect.addEventListener("change", function() {
  const selectedWaypointIndex = waypointSelect.selectedIndex;
  const selectedWaypoint = waypointData[selectedWaypointIndex]; // Assuming waypoint data is stored in waypointData object
});

const waypointData = [
  { lat: 14.67802, lng: 121.1276, name: "Thelma Store"} ,
  { lat: 14.67716, lng: 121.12868, name: "Ilang-Ilang"} ,
  { lat: 14.67687, lng: 121.12895, name: "St. Thomas"} ,
  { lat: 14.67654, lng: 121.12881, name: "St. Andrew"} ,
  { lat: 14.67579, lng: 121.12909, name: "St. Patrick"} ,

];

function checkDistanceFromWaypoint(userLocation) {
  if (!selectedWaypoint) { // Check if a waypoint is selected
    return; // Do nothing if no waypoint is chosen
  }
  
  const waypointLatLng = new google.maps.LatLng(selectedWaypoint.lat, selectedWaypoint.lng);
  const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, waypointLatLng);
  if (distance <= notificationDistance) {
    showNotification("You are near " + selectedWaypoint.name + "!");
  }
}

function checkDistanceFromWaypoint(userLocation) {
  if (!selectedWaypoint) { // Check if a waypoint is selected
    return; // Do nothing if no waypoint is chosen
  }
  
  const waypointLatLng = new google.maps.LatLng(selectedWaypoint.lat, selectedWaypoint.lng);
  const distanc = google.maps.geometry.spherical.computeDistanceBetween(userLocation, waypointLatLng);
  if (distance <= notificationDistance) {
    showNotification("You are near " + selectedWaypoint.name + "!");
  }
}

function initMap() {
const options = {
center: { lat: 14.67654, lng: 121.12881 },
zoom: 15,
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
origin: { lat: 14.67826, lng: 121.12715 },
destination: { lat: 14.67455, lng: 121.13012 },
travelMode: 'DRIVING',
waypoints: [
  { location: { lat: 14.67802, lng: 121.1276 } },
  { location: { lat: 14.67716, lng: 121.12868 } },
  { location: { lat: 14.67687, lng: 121.12895 } },
  { location: { lat: 14.67654, lng: 121.12881 } },
  { location: { lat: 14.67579, lng: 121.12909 } },
]
};

directionsService.route(route, (result, status) => {
if (status === 'OK') {
    directionsRenderer.setDirections(result);
} else {
    console.error("Directions request failed due to " + status);
}
});

function updateRoute(event) {
  // Code to update route based on selected waypoint
}

const waypointSelect = document.getElementById("waypointSelect");
waypointSelect.addEventListener("change", updateRoute);
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

  checkDistanceFromWaypoint(userLocation);
}        

function stopTracking() {
if (watchId) {
navigator.geolocation.clearWatch(watchId);
watchId = null;
}}

function checkDistanceFromDestination(userLocation) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, new google.maps.LatLng(destination.lat, destination.lng));
    if (distance <= notificationDistance) {
        showNotification("You are near your destination!");
    }
}

function showNotification(message) {
  if ('Notification' in window) {
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        new Notification(message);
      } else {
        // Handle denied permission (e.g., display a message to the user)
        console.warn("Notification permission denied!");
      }
    });
  }
}

let lastNotificationTime = null;

function updateJeepneyPosition(position) {
  // ... existing code ...

  const currentTime = Date.now();
  const notificationThreshold = 5000; // Minimum time between notifications in milliseconds

  if (lastNotificationTime === null || (currentTime - lastNotificationTime) >= notificationThreshold) {
    checkDistanceFromWaypoint(position);
    lastNotificationTime = currentTime;
  }
}


