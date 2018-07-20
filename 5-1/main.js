$("#map").width("100%")
$("#map").height("600px")

const basemap = {
  "URL": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
  "attribution": "&copy; OpenStreetMap contributors"
  }

var base = new L.TileLayer(basemap.URL, {
  attribution: basemap.attribution,
  maxZoom: 15,
  minZoom: 8
});

var map = new L.Map('map', {layers: [base], center: new L.LatLng(35.7000, 139.430), zoom: 10});
L.svg().addTo(map)
