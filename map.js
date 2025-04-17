import { MinPriorityQueue, MaxPriorityQueue } from './node_modules/@datastructures-js/priority-queue';

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

// create custom button
const customControl = L.Control.extend({
    // button position
    options: {
      position: "topleft",
      className: "locate-button leaflet-bar",
      html: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>',
      style:
        "margin-top: 0; left: 0; display: flex; cursor: pointer; justify-content: center; font-size: 2rem;",
    },
  
    // method
    onAdd: function (map) {
      this._map = map;
      const button = L.DomUtil.create("div");
      L.DomEvent.disableClickPropagation(button);
  
      button.title = "locate";
      button.innerHTML = this.options.html;
      button.className = this.options.className;
      button.setAttribute("style", this.options.style);
  
      L.DomEvent.on(button, "click", this._clicked, this);
  
      return button;
    },
    _clicked: function (e) {
      L.DomEvent.stopPropagation(e);
  
      // this.removeLocate();
  
      this._checkLocate();
  
      return;
    },
    _checkLocate: function () {
      return this._locateMap();
    },
  
    _locateMap: function () {
      const locateActive = document.querySelector(".locate-button");
      const locate = locateActive.classList.contains("locate-active");
      // add/remove class from locate button
      locateActive.classList[locate ? "remove" : "add"]("locate-active");
  
      // remove class from button
      // and stop watching location
      if (locate) {
        this.removeLocate();
        this._map.stopLocate();
        return;
      }
  
      // location on found
      this._map.on("locationfound", this.onLocationFound, this);
      // locataion on error
      this._map.on("locationerror", this.onLocationError, this);
  
      // start locate
      this._map.locate({ setView: true, enableHighAccuracy: true });
    },
    onLocationFound: function (e) {
      // add circle
      this.addCircle(e).addTo(this.featureGroup()).addTo(map);
  
      // add marker
      this.addMarker(e).addTo(this.featureGroup()).addTo(map);
  
      // select 3 closest markers
      console.log("On Location Found: ");
      console.log(e.latlng);

      selectNNearestSpots(e.latitude, e.longitude, 3);
    },
    // on location error
    onLocationError: function (e) {
      this.addLegend("Location access denied.");
    },
    // feature group
    featureGroup: function () {
      return new L.FeatureGroup();
    },
    // add legend
    addLegend: function (text) {
      const checkIfDescriotnExist = document.querySelector(".description");
  
      if (checkIfDescriotnExist) {
        checkIfDescriotnExist.textContent = text;
        return;
      }
  
      const legend = L.control({ position: "bottomleft" });
  
      legend.onAdd = function () {
        let div = L.DomUtil.create("div", "description");
        L.DomEvent.disableClickPropagation(div);
        const textInfo = text;
        div.insertAdjacentHTML("beforeend", textInfo);
        return div;
      };
      legend.addTo(this._map);
    },
    addCircle: function ({ accuracy, latitude, longitude }) {
      return L.circle([latitude, longitude], accuracy / 2, {
        className: "circle-test",
        weight: 2,
        stroke: false,
        fillColor: "#136aec",
        fillOpacity: 0.15,
      });
    },
    addMarker: function ({ latitude, longitude }) {
      return L.marker([latitude, longitude], {
        icon: L.divIcon({
          className: "located-animation",
          iconSize: L.point(17, 17),
          popupAnchor: [0, -15],
        }),
      }).bindPopup("You are here :)");
    },
    removeLocate: function () {
      this._map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          const { icon } = layer.options;
          if (icon?.options.className === "located-animation") {
            map.removeLayer(layer);
          }
        }
        if (layer instanceof L.Circle) {
          if (layer.options.className === "circle-test") {
            map.removeLayer(layer);
          }
        }
      });
    },
  });

  // adding new button to map control
map.addControl(new customControl());

function selectNNearestSpots(lat, lnd, n) {
  const minHeap = new MinPriorityQueue();
  
  for (let i = 0; i < points.length; i++) {
    let x = Math.abs(points[0] - lat);
    let y = Math.abs(points[1] - lnd);
    let dist = Math.sqrt(x^2 + y^2); // pythagorean theorem

    minHeap.enqueue(points[i], dist)
  }

  console.log(minHeap.toArray());
}