/* eslint-disable no-undef */
/**
 * Simple map
 */

// config map
let config = {
    minZoom: 7,
    maxZoom: 18,
};
// magnification with which the map will start
const zoom = 11;
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

// loop that adds many markers to the map
for (let i = 0; i < points.length; i++) {
    const [lat, lng, popupText] = points[i];
    marker = new L.marker([lat, lng]).bindPopup(popupText).addTo(map);
}

function redirect(e) {
    console.log(e);
    window.location.href = "about.html"
}