/* eslint-disable no-undef */
/**
 * Simple map
 */

// config map
let config = {
    minZoom: 10,
    maxZoom: 18,
};
// magnification with which the map will start
const zoom = 12;
// co-ordinates
const lat = 40.70776262013541;
const lng = -73.93312344477506;

let points = [
    [40.75015418807684, -73.94879211615797, "Modega"],
    [40.763015759641846, -73.83082337383044, "Evolute"],
    [40.7193125558938, -73.95163474634303, "McCarren Park"],
    [40.64412262127368, -73.97576290819286, "360flow Dance Studio"],
    [40.71196466841747, -73.93563554499588, "Brooklyn Zoo"],
    [40.75156767880474, -73.83396400452277, "Al Oerter Recreation Center"],
    [40.75372727254618, -73.93355527448894, "Ladies of Hip Hop"]
];

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
var Jawg_Terrain = L.tileLayer(
    "https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}",
    {
        attribution:
            '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        accessToken:
            "6WApZpI9qZ2egPiF1qjUCMaFfkN3BpUUPFtS1iLk5JKKZmUbMnLpOnNhlxzFuQTh",
    }
).addTo(map);

// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(map);

// loop that adds many markers to the map
for (let i = 0; i < points.length; i++) {
    const [lat, lng, popupText] = points[i];
    marker = new L.marker([lat, lng]).bindPopup(popupText).addTo(map).on("click", clickZoom);;
}

// // When this option is set, the map restricts the view to the given geographical bounds, bouncing the user back if the user tries to pan outside the view. To set the restriction dynamically, use setMaxBounds method.
// // coordinates limiting the map
// function getBounds() {
//     const southWest = new L.LatLng(39.74995281966109, -75.5430254302778);
//     const northEast = new L.LatLng(41.76508099917945, -72.55441482313798);
//     return new L.LatLngBounds(southWest, northEast);
// }

// // set maxBounds
// map.setMaxBounds(map.getBounds());

// // zoom the map to the polyline
// map.fitBounds(getBounds(), { reset: true });

// set center map
function clickZoom(e) {
    map.setView(e.target.getLatLng(), zoom);
    // pantTo version
    // map.panTo(e.target.getLatLng());
}